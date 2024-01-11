"use server"

import supabaseServer from "@/app/actions/supabaseServer"

export default async function getWorkspace(id: string) {

	if (!id) {
		return undefined
	}

	const supabase = supabaseServer()

	const { error, data } = await supabase
		.from("workspaces")
		.select("id, name, plan, team_id")
		.eq("id", id)

	if (error) {
		return { err: error }
	}

	if (!data) {
		return {
			err: "not found"
		}
	}

	if (data.length < 1) {
		return {
			err: "not found"
		}
	}

	return {
		data: data[0]
	}

}