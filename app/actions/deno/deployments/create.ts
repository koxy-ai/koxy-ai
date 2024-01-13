"use server"

import getRequired from "@/scripts/deno/getRequired"
import supabaseServer from "@/app/actions/supabaseServer"
import type Deployment from "@/scripts/deployments/type"

type DeploymentOptions = {
	entryPointUrl: string,
	assets: Object,
	envVars: Object,
	description?: string | null,
	importMapUrl?: string | null,
	lockFileUrl?: string | null,
	compilerOptions?: {
		jsx?: string | null,
		jsxFactory?: string | null,
		jsxFragmentFactory?: string | null,
		jsxImportSource?: string | null,
	},
}

type Owner = {
	name: string,
	avatar: string
}

export default async function createDeployment(projectId: string, owner: Owner, options: any): null | Deployment {

	const { api, org, token, headers } = getRequired()
	const supabase = supabaseServer()

	const { data, error } = await supabase
		.from("functions")
		.update({ status: "progressing" })
		.eq("id", projectId)
		.select()

	if (error || !data) {
		return null
	}

	options.description = options.description || "Deployment"
	options.description = `${options.description}::koxy::${owner.name}::koxy::${owner.avatar}`

	try {
		const response = await fetch(`${api}/projects/${projectId}/deployments`, {
			method: "POST",
			headers,
			body: JSON.stringify(options)
		})

		const deployment: Deployment = await response.json()
		const success: Boolean = (response.status === 200) ? true : false

		if (!success) {
			return null
		}

		const check = await markDone(projectId)
		if (!check) {
			return null
		}
		
		return deployment

	}
	catch(err: unkown) {
		return null
	}

}

async function markDone (projectId: string): Promise<Boolean> {
	const supabase = supabaseServer()
	const {error} = await supabase
		.from("functions")
		.update({ status: "ready" })
		.eq("id", projectId)

	return (error) ? false : true
}