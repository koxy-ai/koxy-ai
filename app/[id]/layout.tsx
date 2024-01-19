
import { type ReactNode } from "react"
import { type User } from "@supabase/auth-helpers-nextjs"
import requireAuth from "@/app/auth/require"

const memUser: { value: User | null } = {
	value: null
}

export function getUser() {
	return memUser.value
}

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {

	const user: User | null = memUser.value || await requireAuth()
	memUser.value = user

	if (!user) {
		return <>Need to login</>
	}

	return (
		<>
			{children}
		</>
	)

}