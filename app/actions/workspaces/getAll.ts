"use server"

import supabaseServer from "@/app/actions/supabaseServer"

export default async function getAllWorkspaces() {

	const supabase = supabaseServer()
	const { error, data: workspaces } = await supabase
		.from("workspaces")
		.select('id, name, plan')

	return workspaces

}