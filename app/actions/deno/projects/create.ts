"use server";

import getRequired from "@/scripts/deno/getRequired";
import supabaseServer from "@/app/actions/supabaseServer";

type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type Res = {
  success: Boolean;
  data: Project;
};

export type Props = {
  name: string | null;
  createFunction: Boolean;
  workspace: any | null;
};

export default async function createProject(props: Props): Promise<Res | null> {
  const { api, org, token, headers } = getRequired();

  if (props.createFunction) {
    const check = await checkWorkspace(props?.workspace?.id);
    if (!check) {
      return null;
    }
  }

  try {
    const response = await fetch(`${api}/organizations/${org}/projects`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: props.name,
      }),
    });

    const project: Project = await response.json();
    const success: Boolean = response.status === 200 ? true : false;

    if (success && props.createFunction && props.workspace) {
      const supabase = supabaseServer();
      await supabase.from("functions").insert({
        id: project?.id,
        name: project?.name,
        workspace_id: props?.workspace?.id,
        team_id: props?.workspace?.team_id,
      });
    }

    return { success, data: project };
  } catch (err: any) {
    return null;
  }
}

async function checkWorkspace(workspaceId: string): Promise<Boolean> {
  const supabase = supabaseServer();

  const { error, data } = await supabase
    .from("workspaces")
    .select("plan")
    .eq("id", workspaceId);

  if (error || !data) {
    return false;
  }

  const workspace = data[0] || {};
  const plan = workspace?.plan;

  return !plan || plan === "free" ? false : true;
}
