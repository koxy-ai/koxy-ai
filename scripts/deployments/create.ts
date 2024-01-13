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

export default async function createDeployment(projectId: string, options: any): null | Deployment {

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

	try {
		const response = await fetch(`${api}/projects/${projectId}/deployments`, {
			headers,
			body: JSON.stringify(options)
		})

		const deployment: Deployment = await response.json()

		supabase
			.from("functions")
			.update({ status: "Ready" })
			.eq("id", projectId)

		return deployment

	}
	catch() {
		return null
	}

}