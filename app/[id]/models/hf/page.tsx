"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"

import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import actions from "../sidebarActions"

import WorkspaceHeadInfo from "@/components/layout/WorkspaceHeadInfo"
import Icon from "@/components/Icon"
import { Button, Heading, Tooltip, Text, Table } from "@radix-ui/themes"

import getModel, { type PrsedModelData } from "@/app/actions/models/getModel_hf"
import is from "@/scripts/is"
import parseModelData from "@/scripts/models/parseData"
import checkPlan from "@/scripts/models/checkPlan"

const HFModel = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

function Page({ workspace, user }: PageProps) {

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

	if (!model_id) {
		router.push("/not-found")
		return null
	}

	const [ model, setModel ] = useState<any>(null)

	useEffect( () => {
		getModel(model_id).then( (data: any) => {
			is([data, "object"], (data: typeof data) => {
				if (data.error) {
					router.push("/not-found")
					return
				}
				setModel(data)
			})
		})
	}, [])

	const modelName = (name: string) => {
		if (name.includes("/")) {
			return name.split("/")[1]
		}
		return name
	}

	return (
		<WorkspaceLayout config={config}>
			
			<main className="innerMain">
				
				<div className="mainHead">
					<div className="flex flex-col w-full gap-2 truncate mr-3">
						<Heading size="5">{modelName(model_id)}</Heading>
						<InfoContainer model={model} />
					</div>
					<div className="flex items-center w-full justify-end">
						<Button variant="surface">
							<Icon id="rocket" />
							Deploy model
						</Button>
					</div>
				</div>

				<ModelPage model={model} workspace={workspace} />

			</main>

		</WorkspaceLayout>
	)

}

function ModelPage({ model, workspace }: any) {

	if (!model) {
		return null
	}

	const modelData: PrsedModelData = parseModelData(model)
	const canDeploy = checkPlan(workspace.plan, modelData.plan)

	return (
		<div className="flex flex-col w-full">
			
			<div className="w-full">

				<div className="p-6">
					<div className="flex items-center gap-2 mb-4">
						<div>
							<Heading size="3" color="gray">
								Tasks
							</Heading>
							<Text color="gray" size="2">
								Each task the model can perform will be a unique path in the model's API
							</Text>
						</div>
					</div>

					<ModelTasks tasks={modelData.tasks} />
				</div>

				<div className="p-6 mb-3 border-t-1 border-[var(--gray-a3)]">
					<div className="mb-4">
						<CanDeploy check={canDeploy} />
						<Heading size="3" color="gray">
							Pricing
						</Heading>
						<Text color="gray" size="2">
							Model's pricing, usage, and limits
						</Text>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1 p-1 bg-[#35353535] pl-2 pr-2 rounded-md">
							<div className="text-xs text-gray-400">Usage price: </div>
							<div className="text-xs text-purple-400">Free</div>
						</div>
						<div className="flex items-center gap-1 p-1 bg-[#35353535] pl-2 pr-2 rounded-md">
							<div className="text-xs text-gray-400">Required plan: </div>
							<div className="text-xs text-purple-400">Basic</div>
						</div>
						<div className="flex items-center gap-1 p-1 bg-[#35353535] pl-2 pr-2 rounded-md">
							<div className="text-xs text-gray-400">Rate limited: </div>
							<div className="text-xs text-purple-400">Yes</div>
						</div>
					</div>
				</div>

				<Datasets modelData={modelData} />
				<Papers modelData={modelData} />

			</div>

		</div>
	)

}

function CanDeploy({ check }: { check: Boolean }) {

	if (check) {
		return (
			<div className="flex items-center gap-2 text-purple-500 text-sm mb-4">
				<Icon id="circle-check-filled" />
				You can deploy this model
			</div>
		)
	}

	return (
		<div className="flex items-center gap-2 text-red-500 text-sm mb-4">
			<Icon id="circle-x-filled" />
			You can't deploy this model
		</div>
	)

}

function InfoContainer({ model }: { model: any }) {

	if (!model) {
		return null
	}

	const modelData: PrsedModelData = parseModelData(model)

	return (
		<div className="flex gap-4 truncate mt-1">
			<InfoRow icon="user" title="Developed by" data={modelData?.developer} />
			<InfoRow icon="gavel" title="License" data={`${modelData?.license || "Unknown"} license`} />
			<InfoRow icon="test-pipe" title="Pipeline" data={modelData?.pipeline_tag} />
			{/*<InfoRow icon="vector" title="Architecture" data={modelData?.architecture} />*/}
		</div>
	)

}

function InfoRow({ icon, title, data }: { icon: string, title: string, data: string | null}) {

	if (!data) {
		return null
	}

	return (
		<div className="max-w-max">
			<Tooltip content={title}>
				<div className="flex items-center gap-1 opacity-70 truncate bg-[#41414141] p-1 pl-2 pr-2 rounded-md">
					<Icon id={icon} />
					<Text size="2">{data}</Text>
				</div>
			</Tooltip>
		</div>
	)

}

function Datasets({ modelData }: { modelData: ParsedModelData }) {

	if (!modelData.datasets) {
		return null
	}

	return (
		<div className="border-t-1 border-[var(--gray-a4)] p-6">
			<div className="flex flex-col justify-center mb-4 opacity-70">
				<Heading size="3">
					Datasets
				</Heading>
				<Text color="gray" size="2">Used to train this model</Text>
			</div>
			<div className="flex flex-col gap-3">
				{
					modelData?.datasets.length < 1
						? <div className="flex items-center text-orange-400 gap-1">
							<Icon id="info-circle" />
							<Text size="2">
								No datasets found
							</Text>
						</div>
						: modelData.datasets.map(dataset => (
							<a
								target="_blank"
								href={`https://arxiv.org/pdf/${dataset}.pdf`}
								className="modelTag"
							>
								<Icon id="database" size="small" />
								<Tooltip content={dataset}>
									<div className="truncate">{dataset}</div>
								</Tooltip>
							</a>
						))
				}
			</div>
		</div>
	)

}

function Papers({ modelData }: { modelData: ParsedModelData }) {

	if (!modelData?.papers || modelData?.papers.length < 1) {
		return null
	}

	return (
		<div className="border-t-1 border-[var(--gray-a4)] p-6">
			<div className="flex flex-col justify-center mb-4 opacity-70">
				<Heading size="3">
					Papers
				</Heading>
				<Text color="gray" size="2">Research papers used in this model</Text>
			</div>
			<div className="flex flex-col gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
				{modelData.papers.map(paper => (
					<a
						target="_blank"
						href={`https://arxiv.org/pdf/${paper}.pdf`}
						className="modelTag"
					>
						<Icon id="file-description" size="small" />
						<Tooltip content={paper}>
							<div className="truncate">{paper}</div>
						</Tooltip>
					</a>
				))}
			</div>
		</div>
	)

}

function ModelTasks({ tasks }: { tasks: Array<any> }) {

	return (
		<div className="flex flex-col gap-4 mt-4 grid grid-cols-2">
			{tasks.map(task => (
				<div
					className="p-3 w-full flex bg-[#31313131] rounded-md border-1 border-[var(--gray-a4)]"
					key={`${task.id}_${Date.now()}`}
				>

					<div className="truncate w-full flex flex-col justify-center">
						<div className="flex items-center gap-1 opacity-70 rounded-md">
							<div className="flex items-center gap-1 w-full">
								<Text weight="bold" size="3">
									{task.id}
								</Text>
							</div>
						</div>

						<div className="flex items-center gap-1 mt-2">
							<div className="flex items-center gap-1 text-xs">
								<Text color="gray">Input length:</Text>
								<Text color="purple">{task.min_length || "any"}-{task.max_length || "any"}</Text>
							</div>
						</div>

						{
							typeof task?.prefix === "string"
								? <div className="flex items-center gap-1 text-xs truncate mt-1">
									<Text color="gray">Prefix:</Text>
									<Tooltip content={task?.prefix || "N/A"}>
										<div className="flex items-center gap-1">
											<Text> {task?.prefix} </Text>
											<div className="border-b-1 border-dashed">input</div>
										</div>
									</Tooltip>
								</div>
								: null
						}

					</div>

				</div>
			))}
		</div>
	)

}

function GeneralTask() {

	return (
		<></>
	)

}

export default HFModel