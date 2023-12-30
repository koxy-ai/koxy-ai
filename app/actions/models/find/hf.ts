"use server"

export default async function findHfModels(filter: string) {

	try {
		const req = await fetch(`https://huggingface.co/api/models?limit=100&sort=downloads&direction=-1&filter=${filter}`)
		const data = await req.json()
		return data
	} catch (err: any) {
		return []
	}

}