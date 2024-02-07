"use server";

import supabaseServer from "@/app/actions/supabaseServer";

export type FlowType = {
  id: string;
  name: string;
  created_at: string;
  status: string;
};

export default async function listFlows(
  workspaceId: string,
): Promise<null | FlowType[]> {
  if (!workspaceId || typeof workspaceId !== "string") {
    return [];
  }

  const supabase = supabaseServer();

  const { error, data } = await supabase
    .from("flows")
    .select("id, name, created_at, workspace_id, status")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return null;
  }

  return data as FlowType[];
}
