"use server"

import supabaseServer from "@/app/actions/supabaseServer"

export default async function(id: string) {

	if (!id || typeof id !== "string") {
		return undefined
	}

	const supabase = supabaseServer()

	const { error, data } = await supabase
		.from("workspaces")
		.select("models")
		.eq("id", id)

	if (error) {
		return {
			err: error
		}
	}

	const wantedData = data[0]

	if (!wantedData || typeof wantedData !== "object") {
		return undefined
	}

	return wantedData?.models

}