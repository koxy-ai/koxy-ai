"use server"

import getRequired from "@/scripts/deno/getRequired"

type Project = {
	id: string,
	name: string,
	description: string,
	createdAt: string,
	updatedAt: string
}

type Res = {
	success: Boolean,
	data: Project 
}

export default async function createProject(name: string | null, description: string): Promise<Res | null> {

	const { api, org, token, headers } = getRequired()

	try {
		const response = await fetch(`${api}/organizations/${org}/projects`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				name,
				description
			})
		})

		const project: Project = await response.json()
		const success: Boolean = (response.status === 200) ? true : false

		return {success, data: project}
	}

	catch (err: any) {
		return null
	}

}