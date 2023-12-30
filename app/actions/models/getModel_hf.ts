"use server"

export default async function(id: string) {

	if (!id) {
		return null
	}

	try {
		const req = await fetch(`https://huggingface.co/api/models/${id}`)
		const data = await req.json()
		return data
	} catch (err: any) {
		return null
	}

}