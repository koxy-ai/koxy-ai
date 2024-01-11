"use client"

import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"

const Template = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

function Page({ workspace, user }: PageProps) {

	const config: Config = {
		workspace,
		navbar: {
			active: "demo"
		},
		sidebar: {
			actions: [],
			active: "demo"
		}
	}

	return (
		<WorkspaceLayout config={config}>
			<div></div>
		</WorkspaceLayout>
	)

}

export default Template