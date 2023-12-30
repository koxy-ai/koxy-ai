"use client"

import { usePathname } from "next/navigation"
import getWorkspace from "@/app/actions/workspaces/get"

export default async function workspace(id: string, router: any) {

	const changeRouterPath = (path: string) => {
		router.push(path)
		return null
	}

	if (!id) {
		return changeRouterPath("/")
	}

	const res = await getWorkspace(id)

	if (!res) {
		localStorage.removeItem("latest_workspace")
		return changeRouterPath("/")
	}

	if (res.err || !res.data) {
		localStorage.removeItem("latest_workspace")
		return changeRouterPath("/")
	}

	return res.data

}