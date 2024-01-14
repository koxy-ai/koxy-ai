"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "../WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import actions from "./sidebarActions"

import Icon from "@/components/Icon"
import WorkspaceHeadInfo from "@/components/layout/WorkspaceHeadInfo"
import PricingPlan from "@/components/layout/PricingPlan"
import FirstTimeFeature from "@/components/layout/FirstTimeFeature"
import Card from "@/components/layout/Card"

import { Button, Heading, Text, TextField, DropdownMenu } from "@radix-ui/themes"

import listFunctions from "@/app/actions/workspaces/listFunctions"
import isArray from "@/scripts/isArray"
import is from "@/scripts/is"

const Functions = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

type FunctionType = {
	id: string,
	name: string,
	created_at: string,
	status: string
}

function Page({ workspace, user }: PageProps) {

	const config: Config = {
		workspace,
		navbar: {
			active: "functions"
		},
		sidebar: {
			actions,
			active: "your-functions"
		}
	}

	const router = useRouter()
	const [ functions, setFunctions ] = useState<Array<FunctionType> | null>(null)

	useEffect(() => {
		if (!functions && workspace.plan !== "free") {
			listFunctions(workspace?.id).then( (data: any) => {
				isArray(data, (functionsData: Array<FunctionType>) => {
					setFunctions(functionsData)
				})
			})
			.catch( (err: any) => {}) // No need to do anything here
		}
	}, [])

	if (workspace.plan === "free") {
		return (
			<WorkspaceLayout config={config}>
				<PricingPlan mainFeature="Edge functions" />
			</WorkspaceLayout>
		)
	}

	return (
		<WorkspaceLayout config={config}>
			
			<main className="innerMain">
				
				<div className="mainHead">
					<WorkspaceHeadInfo
						icon="code"
						title="Edge Functions"
						info="Serverless functions served on the edge"
					/>
					<div className="w-full flex items-center justify-end gap-6">
						<Button color="gray" variant="surface" size="2">
							<Icon id="book" />
							Documentation
						</Button>
						<Button 
							onClick={() => router.push("functions/new")}
							variant="surface"
							size="2"
						>
							New function
							<Icon id="chevron-right" />
						</Button>
					</div>
				</div>

				<div className="p-6">
					<FunctionsBody functions={functions} />
				</div>

			</main>

		</WorkspaceLayout>
	)

}

function FunctionsBody({ functions }: { functions: Array<FunctionType> | null }) {

	const router = useRouter()

	if (!functions) {
		return <LoadingFunctions />
	}

	if (functions.length < 1) {
		return <FirstTimeFeature
			icon="code"
			title="Create your first edge function"
			description="
				Edge functions are Serverless TypeScript functions served edge-close to your users, 
				can be excuted from your front-end or integrated into your AI flows
			"
			button={{
				title: "Create function",
				action: () => ( router.push("functions/new") )
			}}
		/>
	}

	const search = () => {
		const input = document.getElementById("functionsSearch")

		is([input, "object"], (input: HTMLInputElement) => {
			const searchValue = (input.value || "").replace(" ", "-").toLowerCase()
			const functionsItems = document.getElementsByClassName("functionItem")

			for (const item in functionsItems) {
				const func = functionsItems[item]
				const id = func.id
				is([id, "string"], async (id: string) => {
					if (!id.includes(searchValue)) {
						func.classList.add("hidden")
					} else {
						func.classList.remove("hidden")
					}
				})
			}
		})

	}

	

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center">
				<TextField.Root>
					<TextField.Slot>
						<Icon id="search" />
					</TextField.Slot>
					<TextField.Input onInput={search} id="functionsSearch" placeholder="Search function by name" />
				</TextField.Root>
			</div>

			<div className="flex items-center gap-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
				{functions.map(functionItem => (
					<div 
						key={functionItem.id}
						className="functionItem"
						id={functionItem.name.replace(" ", "-").toLowerCase()}
					>
						<Card
							title={functionItem.name}
							info={functionItem.id}
							icon={functionItem.status === "progressing" ? "loader" : "code"}
							action={() => router.push(`functions/${functionItem.id}`)}
							Options={() => {
								return (
									<FuncOptions functionItem={functionItem} />
								)
							}}
						/>
					</div>
				))}
			</div>

		</div>
	)

}

const FuncOptions = ({ functionItem }: { functionItem: FunctionType }) => {

	return (
		<>
			<DropdownMenu.Label>{functionItem.name}</DropdownMenu.Label>
			<Option title="Overview" path={functionItem.id} />
			<Option title="Deployments" path={`${functionItem.id}/deployments`} />
			<DropdownMenu.Item>Logs</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<Option title="Settings" path={`${functionItem.id}/settings`} />
			<DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
		</>
	)
}

const Option = ({ title, path }: { title: string, path: string }) => {
	
	const router = useRouter()

	const pushLink = () => {
		router.push(`functions/${path}`)
	}

	return (
		<DropdownMenu.Item onClick={pushLink}>{title}</DropdownMenu.Item>
	)
}

function LoadingFunctions() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center">
				<TextField.Root>
					<TextField.Slot>
						<Icon id="search" />
					</TextField.Slot>
					<TextField.Input id="functionsSearch" placeholder="Search function by name" />
				</TextField.Root>
			</div>

			<div className="flex items-center gap-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-pulse mt-2">
				<div className="p-6 h-24 min-w-[10rem] bg-[#31313131] rounded-xl"></div>
				<div className="p-6 h-24 min-w-[10rem] bg-[#31313131] rounded-xl"></div>
			</div>

		</div>
	)
}

export default Functions