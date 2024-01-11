"use client"

import {
	Button, 
	Heading, 
	Tooltip, 
	Text, 
	Table, 
	Dialog, 
	Flex, 
	TextField, 
	Badge 
} from "@radix-ui/themes"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "@/app/[id]/WorkspacePage"

import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import actions from "../sidebarActions"

import WorkspaceHeadInfo from "@/components/layout/WorkspaceHeadInfo"
import Icon from "@/components/Icon"

import getModel from "@/app/actions/models/getModel_hf"
import is from "@/scripts/is"
import parseModelData, { type ParsedModelData } from "@/scripts/models/parseData"
import checkPlan from "@/scripts/models/checkPlan"
import { marked } from "marked"

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

	const [ model, setModel ] = useState<any>(null)

	const router = useRouter()
	const params = useSearchParams()
	const model_id = params.get("model_id")

	useEffect( () => {
		is([model_id, "string"], (model_id: string) => {
			getModel(model_id).then( (data: any) => {
				is([data, "object"], (data: any) => {
					if (data.error) {
						router.push("/not-found")
						return
					}
					setModel(data)
				})
			})
		})
	}, [])

	if (!model_id) {
		router.push("/not-found")
		return null
	}

	const modelName = (id: string): string => {
		if (id.includes("/")) {
			return id.split("/")[1]
		}
		return id
	}

	return (
		<WorkspaceLayout config={config}>

			<main className="innerMain min-h-screen">
				
				<div className="mainHead group">
					<div className="flex flex-col w-full gap-2 truncate mr-3">
						<div className="flex items-center">
							<div 
								className="m-2 mr-4 mb-4 p-2 w-14 h-14 group-hover:border-pink-400 transition-all border-1 border-[var(--gray-a5)] bg-[#35353535] rounded-xl rotate-[50deg] flex items-center justify-center"
							>
								<img
									src="https://huggingface.co/datasets/huggingface/brand-assets/resolve/main/hf-logo.png"
									className="rotate-[-45deg] grayscale opacity-70"
								/>
							</div>
							<div className="flex flex-col gap-3">
								<div className="w-6 h-6 opacity-80 group-hover:border-pink-400 transition-all duration-[300ms] border-1 border-[var(--gray-a4)] bg-[#31313131] rounded-md rotate-[36deg]"></div>
								<div className="w-6 h-6 opacity-80 group-hover:border-pink-400 transition-all duration-[500ms] border-1 border-[var(--gray-a4)] bg-[#31313131] rounded-md rotate-[15deg]"></div>
							</div>
							<div className="flex flex-col gap-3 ml-3">
								<div className="w-6 h-6 opacity-70 group-hover:border-pink-400 transition-all duration-[700ms] border-1 border-[var(--gray-a4)] bg-[#31313131] rounded-md rotate-[50deg]"></div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Heading size="5">{modelName(model_id)}</Heading>
						</div>
					</div>
					<div className="flex items-center w-full justify-end">
						<Dialog.Root>
							<Dialog.Trigger>
								<Button variant="surface">
									<Icon id="rocket" />
									Connect model
								</Button>
							</Dialog.Trigger>
							<CreateModel router={router} model={model} workspace={workspace} />
						</Dialog.Root>
					</div>
				</div>

				<ModelPage model={model} workspace={workspace} />

			</main>

		</WorkspaceLayout>
	)

}

function ModelPage({ model, workspace }: any) {

	useEffect(() => {
		if (model) {
			const fullReadme = marked.parse(modelData.readme) as string
			let readme: string = fullReadme
			if (readme.includes("<h1>")) {
				const splitContent = fullReadme.split("<h1>")
				readme = splitContent.length > 1 ? "<h1>" + splitContent.slice(1).join("<h1>") : ""
			}
			readme = readme.replace(/<a /g, '<a target="_blank" ')
			const elm = document.getElementById("readmeContainer")

			if (elm) {
				elm.innerHTML = readme
			}
		}
	})

	if (!model) {
		return null
	}

	const modelData: ParsedModelData = parseModelData(model)
	const canDeploy = checkPlan(workspace.plan, modelData.plan)

	return (
		<div className="flex w-full">
			
			<div
				className="max-w-[70%] min-w-[70%] min-h-screen p-6 overflow-auto border-r-1 border-[var(--gray-a4)] leading-normal tracking-normal"
			>
				<InfoContainer model={model} />
				<div id="readmeContainer"></div>
			</div>

			<div className="w-full flex flex-col min-h-screen h-full">

				<div className="p-6">
					<div className="flex items-center gap-2">
						<div>
							<Heading size="3" color="gray">
								Tasks
							</Heading>
						</div>
					</div>
					<ModelTasks tasks={modelData.tasks} />
				</div>

				<div className="p-6 border-t-1 border-[var(--gray-a3)]">
					<div className="mb-4">
						<CanDeploy check={canDeploy} />
						<Heading size="3" color="gray">
							Pricing
						</Heading>
						<Text color="gray" size="2">
							Model pricing and usage
						</Text>
					</div>
					<div className="flex gap-3 flex-col">
						<div className="flex items-center gap-1 p-1 bg-[#35353535] pl-2 pr-2 rounded-md max-w-max">
							<div className="text-xs text-gray-400">Usage price: </div>
							<div className="text-xs text-pink-400">Free</div>
						</div>
						<div className="flex items-center gap-1 p-1 bg-[#35353535] pl-2 pr-2 rounded-md max-w-max">
							<div className="text-xs text-gray-400">Required plan: </div>
							<div className="text-xs text-pink-400">Basic</div>
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
			<div className="flex items-center gap-2 text-pink-500 text-xs mb-4">
				<Icon id="circle-check-filled" />
				You can deploy this model
			</div>
		)
	}

	return (
		<div className="flex items-center gap-2 text-red-500 text-sm mb-4">
			<Icon id="circle-x-filled" />
			You can not deploy this model
		</div>
	)

}

function InfoContainer({ model }: { model: any }) {

	if (!model) {
		return (
			<div className="w-24 h-5 animate-pulse mb-2 flex items-center gap-1 opacity-70 truncate bg-[#41414141] p-1 pl-2 pr-2 rounded-md"></div>
		)
	}

	const modelData: ParsedModelData = parseModelData(model)

	return (
		<div className="flex gap-4 truncate mb-4">
			<InfoRow icon="user" title="Developed by" data={modelData?.developer} />
			<InfoRow icon="gavel" title="License" data={`${modelData?.license || "Unknown"} license`} />
			<InfoRow icon="test-pipe" title="Pipeline" data={modelData?.pipeline_tag} />
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
			<div className="flex flex-col gap-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
				{
					modelData?.datasets.length < 1
						? <div className="flex items-center text-orange-400 gap-1 min-w-max">
							<Icon id="info-circle" />
							<Text size="2">
								No datasets found
							</Text>
						</div>
						: modelData.datasets.map(dataset => (
							<a
								key={dataset}
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
			<div className="flex flex-col gap-3 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
				{modelData.papers.map(paper => (
					<a
						key={paper}
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
		<div className="flex flex-col gap-3 mt-2">
			{tasks.map(task => (
				<div
					className="p-1 w-full flex hover:bg-[#31313131] rounded-md cursor-pointer"
					key={`${task.id}_${Date.now()}`}
				>

					<div className="truncate w-full flex">
						<div className="flex items-center gap-1 opacity-70 rounded-md">
							<div className="flex items-center gap-1 w-full">
								<Text size="2">
									- {task.id}
								</Text>
							</div>
						</div>
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

function CreateModel({ router, model, workspace }: any) {

	if (!model) {
		return null
	}

	return (
		<Dialog.Content
			style={{
				maxWidth: 400,
				backgroundColor: "rgba(7, 7, 7, .7)",
				backdropFilter: "blur(5px)",
			}}
		>
			<Dialog.Title mb="2">Deploy model</Dialog.Title>
			<Dialog.Description size="2" color="gray" mb="5">
				Model ID: {model?.id}
			</Dialog.Description>
			<Flex direction="column" gap="2">
				<TextField.Root mb="3">
					<TextField.Slot>
						<Icon id="robot" />
					</TextField.Slot>
					<TextField.Input
						id="newModelName"
					    placeholder="Name your model (2-24 characters)"
					    mb="2"
					/>
				</TextField.Root>
				<div className="w-full flex items-center justify-end gap-3">
					<Dialog.Close>
						<Button
							variant="soft"
							color="gray"
							mt="2"
							style={{
								maxWidth: "max-content"
							}}
						>
							Cancel
							<Badge variant="surface">Esc</Badge>
						</Button>
					</Dialog.Close>
					<Button
						variant="surface"
						mt="2"
						style={{
							maxWidth: "max-content"
						}}
					>
						Connect
						<Icon id="rocket" />
					</Button>
				</div>
			</Flex>
		</Dialog.Content>
	)

}

export default HFModel