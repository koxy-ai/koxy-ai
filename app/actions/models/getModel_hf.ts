"use server"

export default async function(id: string) {

	if (!id) {
		return null
	}

	try {
		const req = await fetch(`https://huggingface.co/api/models/${id}`)
		const data = await req.json()

		const getReadme = await fetch(`https://huggingface.co/${id}/raw/main/README.md`)
		const readme = await getReadme.text()
		if (readme.length < 1) {
			data["readme"] = null
		}else {
			data["readme"] = readme
		}

		return data
	} catch (err: any) {
		return null
	}

}