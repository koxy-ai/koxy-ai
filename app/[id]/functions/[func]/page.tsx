"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import actions from "./sidebarActions"
import pageInfo from "@/scripts/pageInfo"

import { Button, Text, Heading, Badge } from "@radix-ui/themes"
import Icon from "@/components/Icon"

import type Deployment from "@/scripts/deployments/type"
import getFunction from "@/app/actions/deno/projects/get"

const FunctionPage = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

function Page({ workspace, user }: PageProps) {

	pageInfo(`${workspace.name} - Edge functions`)

	const config: Config = {
		workspace,
		navbar: {
			active: "functions"
		},
		sidebar: {
			actions,
			active: "function-overview"
		}
	}

	const router = useRouter()
	const path = usePathname().split("/")
	const functionId = path[3]

	const [ func, SetFunc ] = useState<null | Deployment>(null)

	useEffect(() => {
		if (func) {
			
		}
	}, [])

	return (
		<WorkspaceLayout config={config}>
			
			<main className="innerMain">
				
				<div className="p-6">
					
					<div className="flex items-center gap-4 text-gray-500">
						<Button onClick={() => router.push(`/${workspace.id}/functions`)} color="gray" variant="ghost">
							<div className="flex items-center gap-2">
								<div className="w-5 h-5 flex items-center justify-center border-1 border-pink-500/50 bg-pink-500/5 rounded-md">
									<Icon id="code" size="12px" />
								</div>
								Edge functions
							</div>
						</Button>
						/
						<Badge color="gray" variant="surface" size="1" className="opacity-80">
							<div className="flex items-center gap-1">
								{functionId.split("-")[0]}
							</div>
						</Badge>
					</div>

				</div>

			</main>

		</WorkspaceLayout>
	)

}

export default FunctionPage