"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import createActions from "./sidebarActions"
import pageInfo from "@/scripts/pageInfo"
import { type User } from "@supabase/auth-helpers-nextjs"

import { Button, Text, Heading, Badge, Dialog, Link, IconButton, DropdownMenu } from "@radix-ui/themes"
import Icon from "@/components/Icon"
import FirstTimeFeature from "@/components/layout/FirstTimeFeature"
import DashedBorders from "@/components/DashedBorders"
import SubmitButton from "@/components/SubmitButton"

import type Deployment from "@/scripts/deployments/type"
import getFunction, { type FuncRes } from "@/app/actions/deno/projects/get"
import createDeployment from "@/app/actions/deno/deployments/create"
import Once from "@/scripts/once"
import timeAgo from "@/scripts/timeAgo"

const FunctionPage = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

const createOnce = new Once()

function Page({ workspace, user }: PageProps) {

	const router = useRouter()
	const functionId = usePathname().split("/")[3]
	const [ func, setFunc ] = useState<null | FuncRes | false>(false)

	const config: Config = {
		workspace,
		navbar: {
			active: "functions"
		},
		sidebar: {
			actions: createActions(functionId),
			active: "function-overview"
		}
	}

	useEffect(() => {
		if (!func) {
			getFunction(functionId).then( (data: FuncRes | null) => setFunc(data) )
		}
	}, [])

	if (func === null) {
		return <Error config={config} />
	}

	if (func === false) {
		return <Loading config={config} />
	}

	pageInfo(`${func.name} - Overview`)

	if (func?.status === "progressing") {
		const { options, owner } = firstDeployment({
			func, user: user as User
		})

		const checkAgain = async () => {
			const data: FuncRes | null = await getFunction(functionId)
			if (data) {
				setFunc(data)
				const deployment = (data.deployments || [])[0]
				if (!deployment) {
					return null
				}
				if (deployment.status === "pending") {
					checkAgain()
				}
			}
		}

		createOnce
			.setAction(async () => {
				const data: Deployment | null = await createDeployment(func?.id, workspace?.team_id, owner, options)
				getFunction(functionId).then( (data: FuncRes | null) => {
					setFunc(data)
					if (data) {
						const deployment = (data.deployments || [])[0]
						if (!deployment) {
							return null
						}
						if (deployment.status === "pending") {
							setTimeout(() => {
								checkAgain()
							}, 1000)
						}
					}
				})
			})
			.setId(func?.id)
			.execute()
	}

	return (
		<WorkspaceLayout config={config}>
			
			<main className="innerMain">

				<div className="p-6 flex items-center border-b-1 border-[var(--gray-a4)]">

					<div className="flex flex-col gap-3 w-full">
						<div className="flex items-center gap-4 text-gray-500">
							<Button onClick={() => router.push(`/${workspace.id}/functions`)} color="gray" variant="ghost">
								<div className="flex items-center gap-2">
									<div className="w-5 h-5 flex items-center justify-center border-1 border-pink-500/50 bg-pink-500/5 rounded-md">
										<Icon id="cloud-code" size="12px" />
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
						<Heading size="7">{func.name}</Heading>
					</div>

					<div className="flex items-center gap-6 w-full justify-end">
						<HeadActions func={func} />
					</div>

				</div>

				<div className="flex w-full p-6 gap-5">
					<Deployment func={func} />
				</div>

			</main>

		</WorkspaceLayout>
	)

}

function HeadActions({ func }: { func: FuncRes }) {

	if (func?.status === "progressing") {
		return null
	}

	return (
		<>
			<Button variant="soft" color="gray" highContrast>
				<Icon id="brand-github-filled" />
				Connect Github
			</Button>
			<Button variant="surface">
				<Icon id="source-code" />
				Playground
			</Button>
		</>
	)

}

function Deployment({ func }: { func: FuncRes }) {

	if (func?.status === "progressing") {
		return <WaitingDeployment />
	}

	if (!func?.deployments || func?.deployments.length < 1) {
		return null
	}

	const deployment: Deployment = func?.deployments[0]
	const updatedAt = String(deployment?.updatedAt || Date.now())
	const description = String(deployment.description || "Waiting for deployment, please wait a second::koxy::").split("::koxy::")[0]
	const date = timeAgo(updatedAt)

	const color = (deployment.status === "success") ? "text-green-500"
		: (deployment.status === "pending") ? "text-orange-500"
		: "text-red-500"

	return (
		<div className="p-5 w-full border-1 border-[var(--gray-a6)] rounded-md bg-[#050505] relative">
			<Badge color="gray">{deployment.id}</Badge>
			<Heading mt="4" mb="3" size="5">Latest deployment</Heading>
			
			<div className="flex items-center gap-1 mb-5">
				<DeployedBy func={func} />
				<div className="flex items-center justify-center opacity-50">
					<Icon id="point-filled" size="small" />
				</div>
				<Text size="2" color="gray">{description}</Text>
			</div>
			<div className="border-t-1 w-full border-[var(--gray-a5)] mb-5"></div>

			<div className="flex gap-8">
				<div className="flex flex-col gap-2">
					<Text className="flex items-center">
						<div className={`${color} flex items-center`}>
							<Icon id="point-filled" size="large" />
						</div>
						<Text size="2" color="gray">{deployment?.status}</Text>
					</Text>
				</div>
				<div className="flex flex-col gap-2">
					<Text size="2" color="gray">
						<div className="flex items-center gap-1 min-w-max">
							<Icon id="clock" />
							{date}
						</div>
					</Text>
				</div>
				<Domains func={func} />
			</div>

			<div className="absolute top-6 right-6 flex items-center gap-6">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<IconButton color="gray" variant="ghost">
							<Icon id="dots" />
						</IconButton>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						variant="soft" 
						color="gray"
						style={{
							backgroundColor: "rgba(100, 100, 100, 0.07)",
							backdropFilter: "blur(15px)",
							minWidth: "8.5rem"
						}}
					>
						<DropdownMenu.Label>{deployment.id}</DropdownMenu.Label>
						<DropdownMenu.Item>Logs</DropdownMenu.Item>
						<DropdownMenu.Item>Build logs</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	)

}

function DeployedBy({ func }: { func: FuncRes }) {

	const deployment = func?.deployments[0]

	if (deployment.status !== "success") {
		return null
	}

	const description = deployment.description || ""
	const avatar = description.split("::koxy::")[2]
	const ownerName = description.split("::koxy::")[1]

	return (
		<div className="flex items-center gap-2">
			<img src={avatar} className="w-6 h-6 object-cover rounded-[99rem] border-1 border-white/30" />
			<Text size="2" color="gray" className="truncate">{ownerName}</Text>
		</div>
	)

}

function Domains({ func }: { func: FuncRes }) {
	
	const deployment: Deployment = func?.deployments[0]
	const domains: Array<string> = deployment.domains || []

	if (!deployment || deployment.status !== "success") {
		return null
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-1">
				{domains.map(domain => (
					<div key={`${domain}-${Math.random()}`}>
						<Link className="flex items-center gap-1" href={`https://${domain}`} target="_blank" color="gray" size="2">
							<Icon id="link" size="small" />
							<div className="truncate max-w-[15rem]">{domain} {domain} {domain}</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}

function WaitingDeployment() {
	return (
		<div className="w-full flex flex-col items-center justify-center relative p-14 gap-2 group">
			<DashedBorders />
			<div
				className="flex items-center justify-center p-3.5 mb-3 rotate-[-20deg] group-hover:border-pink-500/70 transition-all relative text-pink-300 border-1 border-pink-500/50 bg-pink-500/10 rounded-md"
				style={{
					boxShadow: "0px 0px 50px 5px rgba(236,72,153, .07)",
				}}
			>
				<div className="absolute top-0 left-0 w-full h-full animate-ping bg-pink-500/10 rounded-md border-1 border-pink-500/30"></div>
				<div
					className="opacity-60"
					style={{
						boxShadow: "0px 0px 50px 10px rgb(236,72,153)"
					}}
				>
					<DashedBorders />
				</div>
				<Icon id="cloud" size="larger" />
			</div>
			<Heading className="textGradient" mt="4">Deploying function...</Heading>
			<div className="max-w-[70%] flex flex-col items-center justify-center">
				<Text size="3" color="gray" align="center">
					Please wait a second while we deploy your function to the edge cloud
				</Text>
				<Text size="3" color="gray" align="center">
					(No need to refresh the page)
				</Text>
			</div>
		</div>
	)
}

function Error({ config }: { config: Config }) {
	return (
		<WorkspaceLayout config={config}>
			<main className="innerMain p-6">
				Error while getting function data
			</main>
		</WorkspaceLayout>
	)
}

function Loading({ config }: { config: Config }) {
	return (
		<WorkspaceLayout config={config}>
			<main className="innerMain p-6">
				Loading
			</main>
		</WorkspaceLayout>
	)
}

export default FunctionPage