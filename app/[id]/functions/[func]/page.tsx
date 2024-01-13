"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import actions from "./sidebarActions"
import pageInfo from "@/scripts/pageInfo"

import { Button, Text, Heading, Badge, Dialog, Link, IconButton, DropdownMenu } from "@radix-ui/themes"
import Icon from "@/components/Icon"
import FirstTimeFeature from "@/components/layout/FirstTimeFeature"
import DashedBorders from "@/components/DashedBorders"
import SubmitButton from "@/components/SubmitButton"

import type Deployment from "@/scripts/deployments/type"
import getFunction, { type FuncRes } from "@/app/actions/deno/projects/get"
import createDeployment from "@/app/actions/deno/deployments/create"
import Once from "@/scripts/once"

const FunctionPage = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

const createOnce = new Once()

function Page({ workspace, user }: PageProps) {

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

	pageInfo(`${workspace.name} - Edge functions`)
	const router = useRouter()
	const path = usePathname().split("/")
	const functionId = path[3]

	const [ func, setFunc ] = useState<null | Deployment | false>(false)

	useEffect(() => {
		if (!func) {
			getFunction(functionId).then( (data: FuncRes | null) => setFunc(data) )
		}
	}, [])

	const updateFunc = () => {
		getFunction(functionId).then( (data: FuncRes | null) => setFunc(data) )
	}

	if (func === null) {
		return <>Error</>
	}

	if (func === false) {
		return (
			<WorkspaceLayout config={config}>
				<main className="innerMain p-6">
					Loading
				</main>
			</WorkspaceLayout>
		)
	}

	if (func?.status === "progressing") {

		const FirstDeploymentOptions = {
			entryPointUrl: "main.ts",
			assets: {
				"main.ts": {
					kind: "file",
					content: `Deno.serve(() => new Response("Hello, World!"));`,
					encoding: "utf-8"
				}
			},
			envVars: {},
			description: `First deployment in ${func?.name}`
		}

		const owner = {
			name: user?.user_metadata?.full_name || user?.user_metadata?.user_name,
			avatar: user?.user_metadata?.avatar_url
		}

		createOnce
			.setAction(async () => {
				const data: Deployment | null = await createDeployment(func?.id, owner, FirstDeploymentOptions)
				getFunction(functionId).then( (data: FuncRes | null) => setFunc(data) )
			})
			.execute()

	}

	return (
		<WorkspaceLayout config={config}>
			
			<main className="innerMain">
				
				<div className="p-6 flex items-center">
					
					<div className="flex flex-col gap-3 w-full">
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
						<Heading size="7">{func.name}</Heading>
					</div>

					<div className="flex items-center gap-6 w-full justify-end">
						<HeadActions func={func} />
					</div>

				</div>

				<div id="updateFuncData" onClick={updateFunc}></div>

				<div className="p-6 pt-3">
					<Deployment func={func} />
				</div>

			</main>

		</WorkspaceLayout>
	)

}

function HeadActions({ func }: { func: FuncRes }) {

	if (func.status === "progressing") {
		return null
	}

	return (
		<>
			<Button variant="surface" color="gray">
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
		return (
			<WaitingDeployment />
		)
	}

	if (!func?.deployments || func?.deployments.length < 1) {
		return null
	}

	const deployment: Deployment = func?.deployments[0]
	const updatedAt = String(deployment?.updatedAt || "Pending").substring(0, 10)
	const description = String(deployment.description || "Waiting for deployment::koxy::").split("::koxy::")[0]

	const color = (deployment.status === "success") ? "text-green-500"
		: (deployment.status === "pending") ? "text-orange-500"
		: "text-red-500"

	const updateFunc = async () => {
		const elm = document.getElementById("updateFuncData")
		if (elm) {
			elm.click()
		}
	}

	return (
		<div className="p-6 w-full border-1 border-[var(--gray-a6)] rounded-md bg-[#050505] relative">
			<Badge color="gray">{deployment.id}</Badge>
			<Heading mt="3" mb="2" size="5">Latest deployment</Heading>
			
			<div className="flex items-center gap-1 mb-5">
				<Text size="2" color="gray">Updated in {updatedAt}</Text>
				<div className="flex items-center justify-center opacity-50">
					<Icon id="point-filled" size="small" />
				</div>
				<Text size="2" color="gray">{description}</Text>
			</div>
			<div className="border-t-1 w-full border-[var(--gray-a5)] mb-5"></div>

			<div className="flex gap-12">
				<div className="flex flex-col gap-2">
					<Text color="gray" size="2" ml="1">Status</Text>
					<Text className="flex items-center">
						<div className={`${color} flex items-center`}>
							<Icon id="point-filled" size="large" />
						</div>
						<Text size="2">{deployment?.status}</Text>
					</Text>
				</div>

				<DeployedBy func={func} />
				<Domains func={func} />
			</div>

			<div className="absolute top-6 right-6 flex items-center gap-6">
				<Button onClick={updateFunc} color="gray" variant="ghost">
					<Icon id="refresh" /> Refresh
				</Button>
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

	const avatar = deployment.description.split("::koxy::")[2]
	const ownerName = deployment.description.split("::koxy::")[1]

	return (
		<div className="flex flex-col gap-2">
			<Text color="gray" size="2">Deployed by</Text>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<img src={avatar} className="w-6 h-6 object-cover rounded-[99rem]" />
					<Text size="2" color="gray">{ownerName}</Text>
				</div>
			</div>
		</div>
	)

}

function Domains({ func }: { func: FuncRes }) {
	
	const deployment = func?.deployments[0]

	if (!deployment || deployment.status !== "success") {
		return null
	}

	return (
		<div className="flex flex-col gap-2">
			<Text color="gray" size="2">Domains</Text>
			<div className="flex flex-col gap-1">
				{(deployment.domains || []).map(domain => (
					<div key={`${domain}-${Math.random()}`}>
						<Link href={`https://${domain}`} target="_blank" color="gray" size="2">
							<Icon id="link" size="small" /> {domain}
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}

function WaitingDeployment() {
	return (
		<main>
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
					<Icon id="cloud" className="spinner" size="larger" />
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
		</main>
	)
}

export default FunctionPage