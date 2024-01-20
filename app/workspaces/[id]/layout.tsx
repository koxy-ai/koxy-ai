import { type ReactNode } from "react"
import { type User } from "@supabase/auth-helpers-nextjs"
import requireAuth from "@/app/auth/require"
import Header from "@/components/header/Header"
import { defaultLinks } from "@/components/header/HeadLink"

type Props = {
	params: {
		id: string
	},
	children: ReactNode
}

export default async function WorkspaceLayout({ params, children }: Props) {

	const user: User = await requireAuth() as User;

	return (
		<>
			<Header user={user} links={defaultLinks()} activeLink="NAN" />
			{children}
		</>
	)

}