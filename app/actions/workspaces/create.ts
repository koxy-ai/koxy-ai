"use server";

import { randomBytes } from "node:crypto";
import supabaseServer from "@/app/actions/supabaseServer";

export default async function createWorkspace(name: string | null) {
  // Check the workspace name
  name = name || "";

  if (name.length < 3 || name.length > 24) {
    return {
      err: "Workspace name should be more than 3 characters and less than 24",
    };
  }

  // initialize supabase and get current user
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      err: "User not found",
    };
  }

  // generate team ID
  const random = randomBytes(16);
  const team_id = random.toString("hex");

  // Insert a new workspace and validate it
  const insertWorkspace = await insert(supabase, team_id, name);
  if (insertWorkspace.err) {
    return insertWorkspace;
  }

  // Insert a new team member (admin) and validate it
  const insertMember = await addMember(supabase, team_id);
  if (insertMember.err) {
    return insertMember;
  }

  return { success: true };
}

async function insert(supabase: any, team_id: string, name: string) {
  const { error } = await supabase.from("workspaces").insert({
    team_id,
    name,
  });

  if (error) {
    return {
      err: error,
    };
  }

  return { success: true };
}

async function addMember(supabase: any, team_id: string) {
  const { error } = await supabase.from("members").insert({
    id: team_id,
    role: "admin",
  });

  if (error) {
    return {
      err: error,
    };
  }

  return { success: true };
}
