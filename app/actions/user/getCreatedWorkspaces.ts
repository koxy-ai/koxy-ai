"use server";

import supabaseServer from "@/app/actions/supabaseServer";

export default async function getCreatedWorkspaces() {
  const supabase = supabaseServer();
  const {
    data: { user },
  }: any = await supabase.auth.getUser();

  const { data, error }: any = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", user.id);

  return data;
}
