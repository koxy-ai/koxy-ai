"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import createActions from "../sidebarActions"

import WorkspaceHeadInfo from "@/components/layout/WorkspaceHeadInfo"
import { Button, TextField, Badge, Text, Tooltip, Link } from "@radix-ui/themes"
import Icon from "@/components/Icon"
import SubmitButton from "@/components/SubmitButton"

import type Deployment from "@/scripts/deployments/type"
import listDeployments from "@/app/actions/deno/deployments/list"
import Once from "@/scripts/once"
import timeAgo from "@/scripts/timeAgo"

const FunctionDeployments = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

const onceId = {
	value: `deployments-${Date.now()}`
}

const onceAction = new Once()

function Page({ workspace, user }: PageProps) {

	const router = useRouter()
	const functionId = usePathname().split("/")[3]
	const [ deployments, setDeployments ] = useState<null | Array<Deployment>>(null)
	const [ page, setPage ] = useState<number>(1)
	const [ q, setQ ] = useState<string | null>(null)

	const config: Config = {
		workspace,
		navbar: {
			active: "functions"
		},
		sidebar: {
			actions: createActions(functionId),
			active: "function-deployments"
		}
	}

	useEffect(() => {
		onceAction.setAction(() => {
			listDeployments(functionId, {page}).then( (data: Array<Deployment>) => {
				setDeployments(data)
			})
		})
		.setId(onceId.value)
		.execute()
	}, [])

	const loadMore = async () => {
		const newPage = page + 1
		const data: Array<Deployment> = await listDeployments(functionId, {page})
		setPage(newPage)
		setDeployments(data)
	}

	return (
		<WorkspaceLayout config={config}>
			<main className="innerMain">

				<div className="mainHead">
					<WorkspaceHeadInfo
						icon="versions"
						title="Deployments"
						info={`All deployments in ${functionId.split("-")[0]}`}
					/>
					<div className="w-full flex items-center justify-end gap-6">
						<TextField.Root>
							<TextField.Slot>
								<Icon id="search" />
							</TextField.Slot>
							<TextField.Input placeholder="Search by ID" />
						</TextField.Root>
					</div>
				</div>

				<div className="p-6">
					<Deployments deployments={deployments} />
				</div>

				<div className="p-6 flex items-center justify-center">
					{
						(deployments || []).length < 20
							? null
							: <SubmitButton
								variant="soft" 
								color="gray"
								action={loadMore}
							>
								<div>Load more</div>
							</SubmitButton>
					}
				</div>

			</main>
		</WorkspaceLayout>
	)

}

function Deployments({ deployments }: { deployments: null | Array<Deployment> }) {

	if (!deployments) {
		return <>Loading</>
	}

	if (deployments.length < 1) {
		return <>No deployments found</>
	}

	return (
		<div className="flex flex-col gap-4">
			{deployments.map(deployment => (
				<div key={deployment?.id}>
					<DeploymentCard deployment={deployment} />
					{(deployments.indexOf(deployment) < deployments.length-1)
						? <div className="h-5 border-r-1 border-[var(--gray-a4)]"></div>
						: null
					}
				</div>
			))}
		</div>
	)

}

function DeploymentCard({ deployment }: { deployment: Deployment }) {

	const { id, description, updatedAt, domains } = deployment
	const [ info, ownerName, ownerAvatar ] = description.split("::koxy::")
	const date = timeAgo(updatedAt)

	return (
		<div 
			className="p-4 border-1 border-[var(--gray-a4)] rounded-md flex items-center w-full bg-[#25252525] hover:bg-[#28282828]"
		>
			<div className="flex flex-col gap-1">
				<Badge className="max-w-max" variant="soft" mb="1" color="gray">{id}</Badge>
				<Text className="truncate">{info}</Text>
				<div className="flex items-center gap-2 mt-2">
					<Tooltip content={ownerName}>
						<img src={ownerAvatar} className="w-5 rounded-[99rem]" />
					</Tooltip>
					<div className="flex items-center justify-center opacity-50">
						<Icon id="point-filled" size="small" />
					</div>
					<div className="flex flex-col gap-2">
						<Text size="2" color="gray">
							<div className="flex items-center gap-1 min-w-max">
								<Icon id="clock" />
								<Text size="2">{date}</Text>
							</div>
						</Text>
					</div>
					<div className="flex items-center justify-center opacity-50">
						<Icon id="point-filled" size="small" />
					</div>
					<Link href={`https://${domains[0]}`} target="_blank" size="2" color="gray">
						<div className="flex items-center gap-1">
							View
							<Icon id="external-link" />
						</div>
					</Link>
				</div>
			</div>
		</div>
	)

}

export default FunctionDeployments