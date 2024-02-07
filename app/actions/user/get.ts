"use server";

import supabaseServer from "@/app/actions/supabaseServer";
import { UserResponse, type User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function getUser() {
  const supabase = supabaseServer();
  const {
    data: { user },
  }: UserResponse = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth");
  }

  return user as User;
}
