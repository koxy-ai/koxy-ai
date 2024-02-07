"use server";

import getRequired from "@/scripts/deno/getRequired";
import supabaseServer from "@/app/actions/supabaseServer";
import type Deployment from "@/types/deployment";
import type DeploymentOptions from "@/types/deploymentOptions";
import type Owner from "@/types/deploymentOwner";

type Props = [string, string, Owner, DeploymentOptions];

export default async function createDeployment(
  ...props: Props
): Promise<null | Deployment> {
  const [projectId, teamId, owner, options] = props;
  const { api, headers } = getRequired();
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("functions")
    .update({ status: "progressing" })
    .eq("id", projectId)
    .select();

  if (error || !data) {
    return null;
  }

  options.description = options.description || "Deployment";
  options.description = `${options.description}::koxy::${owner.name}::koxy::${owner.avatar}`;

  try {
    const response = await fetch(`${api}/projects/${projectId}/deployments`, {
      method: "POST",
      headers,
      body: JSON.stringify(options),
    });

    const deployment: Deployment = await response.json();
    const success: Boolean = response.status === 200 ? true : false;

    if (!success) {
      return null;
    }

    const check = await markDone(projectId);
    if (!check) {
      return null;
    }

    await supabase.from("code").insert({
      team_id: teamId,
      payload: options,
      deployment_id: deployment?.id,
      function_id: projectId,
    });

    return deployment;
  } catch (err: unknown) {
    return null;
  }
}

async function markDone(projectId: string): Promise<Boolean> {
  const supabase = supabaseServer();
  const { error } = await supabase
    .from("functions")
    .update({ status: "ready" })
    .eq("id", projectId);

  return error ? false : true;
}
