"use server"

import supabaseServer from "@/app/actions/supabaseServer"
import { redirect } from "next/navigation"

export default async function getWorkspace(id: string) {

	if (!id) {
		return redirect("/");
	}

	const supabase = supabaseServer();

	const { error, data } = await supabase
		.from("workspaces")
		.select("id, name, plan, team_id")
		.eq("id", id)

	if (error || !data || data.length < 1) {
		return redirect("/");
	}

	return {
		data: data[0]
	};

}