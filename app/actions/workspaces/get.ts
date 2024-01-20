"use server"

import supabaseServer from "@/app/actions/supabaseServer"
import Workspace from "@/types/workspace";
import { redirect } from "next/navigation"

export default async function getWorkspace(id: string) {

	if (!id) {
		return redirect("/workspaces");
	}

	const supabase = supabaseServer();

	const { error, data } = await supabase
		.from("workspaces")
		.select("id, name, plan, team_id")
		.eq("id", id);

	if (error || !data || data.length < 1) {
		return redirect("/workspaces");
	}

	return data[0] as Workspace;

}