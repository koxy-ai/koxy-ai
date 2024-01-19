"use server"

import supabaseServer from "@/app/actions/supabaseServer"
import isArray from "@/scripts/isArray"

export default async function listFunctions(workspaceId: string) {

	if (!workspaceId || typeof workspaceId !== "string") {
		return []
	}

	const supabase = supabaseServer()

	const { error, data } = await supabase
		.from("flows")
		.select("id, name, created_at, workspace_id, status")
		.eq("workspace_id", workspaceId)
		.order("created_at", { ascending: false })

	return error || data

}