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
import getUser from "@/app/[id]/layout"

import { Button, Heading, Text, TextField, DropdownMenu } from "@radix-ui/themes"

import listFlows from "@/app/actions/workspaces/listFlows"
import isArray from "@/scripts/isArray"
import is from "@/scripts/is"

const Flows = () => ( <WorkspacePage Comp={Page} /> )

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
			active: "flows"
		},
		sidebar: {
			actions,
			active: "your-flows"
		}
	}

	const router = useRouter()
	const [ flows, setFlows ] = useState<Array<FunctionType> | null>(null)

	useEffect(() => {
		if (!flows) {
			listFlows(workspace?.id).then( (data: any) => {
				isArray(data, (flowsData: Array<FunctionType>) => {
					setFlows(flowsData)
				})
			})
			.catch( (err: any) => {}) // No need to do anything here
		}
	}, [])

	return (
		<WorkspaceLayout config={config}>
			
			<main className="innerMain">
				
				<div className="mainHead">
					<WorkspaceHeadInfo
						icon="route"
						title="Flows"
						info="Serverless APIs served on the edge"
					/>
					<div className="w-full flex items-center justify-end gap-6">
						<Button color="gray" variant="soft" size="2">
							<Icon id="book" />
							Documentation
						</Button>
						<Button 
							onClick={() => router.push("flows/new")}
							variant="surface"
							size="2"
						>
							New flow
							<Icon id="chevron-right" />
						</Button>
					</div>
				</div>

				<div className="p-6">
					<FlowsBody flows={flows} />
				</div>

			</main>

		</WorkspaceLayout>
	)

}

function FlowsBody({ flows }: { flows: Array<FunctionType> | null }) {

	const router = useRouter()

	if (!flows) {
		return <LoadingFlows />
	}

	if (flows.length < 1) {
		return <FirstTimeFeature
			icon="route"
			title="Create your first flow"
			description="
				Edge flows are Serverless APIs built using a no-code builder and served edge-close to your users, 
				can be excuted from your front-end.
			"
			button={{
				title: "Create flow",
				action: () => ( router.push("flows/new") )
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
							action={() => router.push(`flows/${functionItem.id}`)}
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
			<Option title="Logs" path={`${functionItem.id}/logs`} />
			<DropdownMenu.Separator />
			<Option title="Settings" path={`${functionItem.id}/settings`} />
			<Option title="Delete" color="red" path={`${functionItem.id}/settings#Danger-zone`} />
		</>
	)
}

const Option = ({ title, path, color }: { title: string, path: string, color?: any }) => {

	const router = useRouter()

	const pushLink = () => {
		router.push(`functions/${path}`)
	}

	return (
		<DropdownMenu.Item color={color || "gray"} onClick={pushLink}>{title}</DropdownMenu.Item>
	)
}

function LoadingFlows() {
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

export default Flows