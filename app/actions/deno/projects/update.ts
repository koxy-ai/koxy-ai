"use server";

import getRequired from "@/scripts/deno/getRequired";
import supabaseServer from "@/app/actions/supabaseServer";

type UpdateRes = {
  success: Boolean;
  message?: string;
};

export default async function updateFunction(
  id: string,
  newName: string,
): Promise<UpdateRes> {
  const supabase = supabaseServer();
  const { api, org, token, headers } = getRequired();

  const { data, error } = await supabase
    .from("functions")
    .select("id, workspace_id")
    .eq("id", id);

  if (error || !data) {
    return { success: false };
  }

  try {
    const res = await fetch(`${api}/projects/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        name: newName,
      }),
    });

    const status = res.status === 200 ? true : false;
    if (status) {
      await supabase
        .from("functions")
        .update({
          name: newName,
        })
        .eq("id", id);
      return { success: status };
    } else {
      const resData = await res.json();
      return {
        success: status,
        message: resData?.message,
      };
    }
  } catch (err: unknown) {
    return {
      success: false,
    };
  }
}
