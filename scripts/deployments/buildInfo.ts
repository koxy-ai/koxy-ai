
import { type User } from "@supabase/auth-helpers-nextjs"
import { type FuncRes } from "@/app/actions/deno/projects/get"
import DeploymentOptions from "@/types/deploymentOptions"

type Props = {
	func: FuncRes,
	user: User
}

type firstDeploymentRes = {
	options: DeploymentOptions,
	owner: {
		name: string,
		avatar: string
	}
}

export function firstDeployment(props: Props): firstDeploymentRes {

	const { func, user } = props

	const firstDeploymentOptions = {
		entryPointUrl: "main.ts",
		assets: {
			"main.ts": {
				kind: "file",
				content: `Deno.serve(() => new Response("Hello, World!"));`,
				encoding: "utf-8"
			}
		},
		envVars: {},
		description: `First deployment in ${func?.name}`
	}

	const owner = {
		name: user?.user_metadata?.full_name || user?.user_metadata?.user_name,
		avatar: user?.user_metadata?.avatar_url
	}

	return {
		options: firstDeploymentOptions,
		owner
	}

}