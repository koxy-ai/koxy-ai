"use client"

import { useRouter, useSearchParams } from "next/navigation"

import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"
import WorkspaceHeadInfo from "@/components/layout/WorkspaceHeadInfo"

import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import actions from "../../sidebarActions"

const DeployHFModel = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

function Page({ user, workspace }: PageProps) {

	const config: Config = {
		workspace,
		navbar: {
			active: "models"
		},
		sidebar: {
			actions,
			active: "N/A"
		}
	}

	const router = useRouter()
	const params = useSearchParams()
	const model_id = params.get("model_id")

	return (
		<WorkspaceLayout config={config}>
			
			<div className="mainHead">
				<WorkspaceHeadInfo
					icon="rocket"
					title="Deploy model"
					info={`Model ID: ${model_id}`}
				/>
			</div>

		</WorkspaceLayout>
	)

}

export default DeployHFModel