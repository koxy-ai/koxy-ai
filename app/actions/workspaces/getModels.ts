"use server"

import supabaseServer from "@/app/actions/supabaseServer"

export default async function(id: string) {

	if (!id || typeof id !== "string") {
		return undefined
	}

	const supabase = supabaseServer()

	const { error, data } = await supabase
		.from("models")
		.select("*")

	if (error) {
		return {
			err: error
		}
	}

	return data

}