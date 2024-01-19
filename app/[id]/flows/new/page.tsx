"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "../../WorkspacePage"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import actions from "../sidebarActions"

import Icon from "@/components/Icon"
import PricingPlan from "@/components/layout/PricingPlan"
import DashedBorders from "@/components/DashedBorders"
import SubmitButton from "@/components/SubmitButton"

import { toast } from "sonner"
import createProject from "@/app/actions/deno/projects/create"

import { Button, Heading, Text, TextField, TextArea, Badge } from "@radix-ui/themes"

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"

import listFunctions from "@/app/actions/workspaces/listFunctions"
import isArray from "@/scripts/isArray"

const Functions = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

function Page({ workspace, user }: PageProps) {

	const config: Config = {
		workspace,
		navbar: {
			active: "flows"
		},
		sidebar: {
			actions,
			active: "new-flow"
		}
	}

	const router = useRouter()

	const createFlow = async () => {
		const elm = document.getElementById("flowName") as HTMLInputElement
		const name = elm.value || null
		startCreating()
		document.getElementById("openFlowCreating").click()
	}

	const startCreating = (name: string | null) => {

	}

	return (
		<WorkspaceLayout config={config}>
			
			<main className="innerMain p-6 flex items-center justify-center">
				<div className="flex flex-col max-w-max items-center justify-center relative p-14 gap-2 group">
					<DashedBorders />
					<div
						className="flex items-center justify-center p-3.5 mb-4 rotate-[-20deg] group-hover:border-pink-500/70 transition-all relative text-pink-300 border-1 border-pink-500/50 bg-pink-500/10 rounded-md"
						style={{
							boxShadow: "0px 0px 50px 5px rgba(236,72,153, .07)"
						}}
					>
						<div
							className="opacity-60"
							style={{
								boxShadow: "0px 0px 50px 10px rgb(236,72,153)"
							}}
						>
							<DashedBorders />
						</div>
						<Icon id="route" size="larger" />
					</div>

					<Heading mb="5">
						New serverless flow
					</Heading>

					<div className="p-4 pt-6 pb-6 border-b-1 border-t-1 border-[var(--gray-a4)] w-full flex flex-col lg:flex-row lg:items-center">
						<div className="flex flex-col gap-1">
							<Text className="lg:min-w-max">Flow name</Text>
							<Text size="2" color="gray">
								Can be changed later (Leave empty to generate a random name)
							</Text>
						</div>
						<div className="flex w-full items-center mt-4 lg:mt-0 lg:justify-end">
							<TextField.Root>
								<TextField.Slot>
									<Icon id="grid-3x3" />
								</TextField.Slot>
								<TextField.Input id="flowName" placeholder="Enter flow name" />
							</TextField.Root>
						</div>
					</div>

					<div className="p-4 w-full flex items-center justify-end">
						<SubmitButton action={createFlow}>
							<div className="flex items-center gap-1">
								Create flow
								<Icon id="chevron-right" />
							</div>
						</SubmitButton>
					</div>

				</div>

			</main>

			<Drawer>
				<DrawerTrigger className="w-full" asChild>
					<div id="openFlowCreating"></div>
				</DrawerTrigger>
				<DrawerContent>
					<div className="p-2 pl-6 flex flex-col gap-1">
						<Text size="2">Creating flow</Text>
						<Text color="gray">Please don't leave this page</Text>
					</div>
					<div className="p-6 pb-12 flex items-center w-full">
						<div className="flex flex-col items-center max-w-max min-w-max gap-2">
							<div className="w-12 h-12 rounded-[99rem] bg-pink-500 flex items-center justify-center">
								<Icon id="circle-check" size="larger" />
							</div>
							<div className="text-xs">Check workspace data</div>
						</div>
						<div className="w-full border-t-4 border-[var(--gray-a5)]"></div>
						<div className="flex flex-col items-center max-w-max min-w-max gap-2">
							<div className="w-12 h-12 rounded-[99rem] bg-[#61616161] flex items-center justify-center">
								<div style={{ animation: "spinner 1s linear infinite"}} className="flex items-center justify-center opacity-60">
									<Icon id="loader-2" />
								</div>
							</div>
							<div className="text-xs">Create flow sandbox</div>
						</div>
						<div className="w-full border-t-4 border-[var(--gray-a5)]"></div>
						<div className="flex flex-col items-center max-w-max min-w-max gap-2">
							<div className="w-12 h-12 rounded-[99rem] bg-[#35353535] flex items-center justify-center"></div>
							<div className="text-xs">Deploy to the cloud</div>
						</div>
					</div>
					<div className="p-6 pt-0">
						<div className="text-sm text-red-500">You can't create more than one plan</div>
					</div>
				</DrawerContent>
			</Drawer>

		</WorkspaceLayout>
	)

}

export default Functions