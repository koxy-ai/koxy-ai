"use server";

import supabaseServer from "@/app/actions/supabaseServer";
import type Workspace from "@/types/workspace";

export default async function getAllWorkspaces(): Promise<null | Workspace[]> {
  const supabase = supabaseServer();
  const { error, data: workspaces } = await supabase
    .from("workspaces")
    .select("id, name, plan");

  if (error || !workspaces) {
    return null;
  }

  return workspaces as Workspace[];
}
