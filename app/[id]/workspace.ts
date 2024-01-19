
import getWorkspace from "@/app/actions/workspaces/get"
import { redirect } from "next/navigation"

export default async function workspace(id: string) {

	const changeRouterPath = (path: string) => {
		return redirect(path)
	}

	if (!id) {
		return changeRouterPath("/")
	}

	const res = await getWorkspace(id)

	if (!res) {
		return changeRouterPath("/")
	}

	if (res.err || !res.data) {
		return changeRouterPath("/")
	}

	return res.data

}