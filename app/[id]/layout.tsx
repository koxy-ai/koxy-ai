
import { type ReactNode } from "react"
import { type User } from "@supabase/auth-helpers-nextjs"
import requireAuth from "@/app/auth/require"
import { redirect } from "next/navigation"
import getWorkspace from "../actions/workspaces/get"

type Params = {
	id: string
}

const memUser: { value: User | null } = {
	value: null
}

export default async function WorkspaceLayout({ params, children }: { params: Params, children: ReactNode }) {

	const user: User | null = memUser.value || await requireAuth()
	memUser.value = user

	if (!user) {
		return redirect("/auth")
	}

	await getWorkspace(params.id)

	return (
		<>
			{children}
		</>
	)

}