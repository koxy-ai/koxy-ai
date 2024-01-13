"use server"

import getRequired from "@/scripts/deno/getRequired"
import supabaseServer from "@/app/actions/supabaseServer"
import type Deployment from "@/scripts/deployments/type"

export type FuncRes = {
	name: string,
	id: string,
	status: string,
	deployments: Array<Deployment>
}

export default async function getProject(id: string): FuncRes | null {

	const supabase = supabaseServer()
	const { api, org, token, headers } = getRequired()

	const { data, error } = await supabase
		.from("functions")
		.select("id, name, status")
		.eq("id", id)

	if (error || !data) {
		return null
	}

	const func = data[0]
	if (!func) {
		return null
	}

	try {
		const res = await fetch(`${api}/projects/${func.id}/deployments?limit=1&sort=created_at`, {headers})
		let deployments: Array<Deployment> = await res.json()
		return {
			name: func.name,
			id: func.id,
			status: func.status,
			deployments
		}
	}

	catch(err: unknown) {
		return null
	}

}