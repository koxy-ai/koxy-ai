"use server";

import getRequired from "@/scripts/deno/getRequired";
import supabaseServer from "@/app/actions/supabaseServer";

export default async function deleteFunction(id: string): Promise<Boolean> {
  const supabase = supabaseServer();
  const { api, org, token, headers } = getRequired();

  const { error } = await supabase.from("functions").delete().eq("id", id);

  if (error) {
    return false;
  }

  await supabase.from("code").delete().eq("function_id", id);

  try {
    const res = await fetch(`${api}/projects/${id}`, {
      method: "DELETE",
      headers,
    });
    return res.status === 200 ? true : false;
  } catch (err: unknown) {
    return false;
  }
}
