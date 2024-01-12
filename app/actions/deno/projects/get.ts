"use server"

import getRequired from "@/scripts/deno/getRequired"
import supabaseServer from "@/app/actions/supabaseServer"
import type Deployment from "@/scripts/deployments/type"

export default async function getProject(id: string): Deployment | null {

	const supabase = supabaseServer()
	const { api, org, token, headers } = getRequired()

	const { data, error } = await supabase
		.from("functions")
		.select("id, name")
		.eq("id", id)

	if (error || !data) {
		return null
	}

	const func = data[0]
	if (!func) {
		return null
	}

	try {
		const res = await fetch(`${api}/projects/${func.id}/deployments?limit=1&sort=created_at`)
		const latestDeployment: Deployment = await (res.json())[0] as Deployment
		latestDeployment.name = func.name
		return latestDeployment
	}

	catch(err: unknown) {
		return null
	}

}