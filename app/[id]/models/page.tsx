"use client"

import { useEffect, useState } from "react"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "../WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"

import actions from "./sidebarActions"
import Icon from "@/components/Icon"
import WorkspaceHeadInfo from "@/components/layout/WorkspaceHeadInfo"
import Image from "next/image"

import createProject from "@/app/actions/deno/projects/create"
import getModels from "@/app/actions/workspaces/getModels"
import isArray from "@/scripts/isArray"

import {
	Heading,
	Text,
	Button,
	Badge
} from "@radix-ui/themes"

const WorkspaceModels = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

function Page({ workspace, user }: PageProps) {

	// createProject("my-project", "custom projects")

	const config: Config = {
		workspace,
		navbar: {
			active: "models"
		},
		sidebar: {
			actions,
			active: "your_models"
		}
	}

	const [ models, setModels ] = useState<any | Array<any>>(null)

	useEffect( () => {
		getModels(workspace.id).then( (data: any) => {
			if (!data) {
				return undefined
			}
			isArray(data, (data: Array<any>) => {
				setModels(data)
			})
		})
	}, [])

	return (
		
		<WorkspaceLayout config={config}>
			<main className="innerMain">
				
				<div className="mainHead">
					<WorkspaceHeadInfo
						icon="robot"
						title="Your Models"
						info="Cloud-hosted AI models served on the edge"
					/>
					<div className="w-full flex items-center justify-end gap-6">
						<Button color="gray" variant="outline" size="2">
							<Icon id="book" />
							Docs
						</Button>
						<Button variant="surface" size="2">
							New model
							<Icon id="chevron-right" />
						</Button>
					</div>
				</div>

				<div className="p-6">
					<ModelsList models={models} />
				</div>

			</main>
		</WorkspaceLayout>

	)

}

function ModelsList({ models }: { models: Array<any> | null }) {

	if (!models) {
		return <ModelsLoading />
	}

	if (models.length < 1) {
		return <NoModels />
	}

	return (
		<></>
	)

}

function NoModels() {

	const CheckRow = ({ info }: { info: string }) => {
		return (
			<div className="flex items-center gap-2">
				<div className="w-6 h-6 flex items-center justify-center bg-[#31313131] rounded-md border-1 border-[#35353535]">
					<Icon id="check" size="small" />
				</div>
				<Text color="gray" size="2">
					{info}
				</Text>
			</div>
		)
	}

	return (
		<div className="p-10 flex items-center">
			<div className="w-full">
				<Heading size="7" mb="2">
					Create & deploy your own
				</Heading>
				<div className="flex items-center gap-3 mb-3">
					<Heading size="7">
						AI models
					</Heading>
				</div>
				<Text mb="2" color="gray" size="2">
					Integrate thousands of customizable AI models into your flows and projects with only few clicks
				</Text>
				<div className="flex flex-col gap-5 mt-6 mb-8">
					<CheckRow info="Production-ready serverless APIs for all your models" />
					<CheckRow info="Customize and fine-tune your models" />
					<CheckRow info="Create advaced LLMs with your own data" />
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 flex items-center justify-center bg-[#31313131] rounded-md border-1 border-[#35353535]">
							<Icon id="star" size="small" />
						</div>
						<Text color="gray" size="2">
							Fair pricing based on your usage (free models included)
						</Text>
					</div>
				</div>
				<Button>Create first model</Button>
			</div>
			<div className="w-full">
				
			</div>
		</div>
	)

}

function ModelsLoading() {

	return (
		<div className="animate-pulse">
			<div className="flex items-center w-full mb-4">
				<div className="min-w-[70%] p-3 bg-[#31313131] rounded-md"></div>
			</div>
			<div className="flex flex-col gap-6 grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 transition-all">
				<div className="p-10 bg-[#29292929] rounded-xl w-full"></div>
				<div className="p-10 bg-[#29292929] rounded-xl w-full"></div>
				<div className="p-10 bg-[#29292929] rounded-xl w-full"></div>
			</div>
		</div>
	)

}

export default WorkspaceModels