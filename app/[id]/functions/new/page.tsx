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

import { Button, Heading, Text, TextField, TextArea } from "@radix-ui/themes"

import listFunctions from "@/app/actions/workspaces/listFunctions"
import isArray from "@/scripts/isArray"

const Functions = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

type FunctionType = {
	id: string,
	name: string,
	created_at: string
}

function Page({ workspace, user }: PageProps) {

	const config: Config = {
		workspace,
		navbar: {
			active: "functions"
		},
		sidebar: {
			actions,
			active: "new-function"
		}
	}

	const router = useRouter()

	if (workspace.plan === "free") {
		return (
			<WorkspaceLayout config={config}>
				<PricingPlan mainFeature="Edge functions" />
			</WorkspaceLayout>
		)
	}

	const createFunction = async () => {
		const elm = document.getElementById("functionName") as HTMLInputElement
		const name = elm.value || null
		const res: any = await createProject({
			name,
			createFunction: true,
			workspace
		})
		if (!res) {
			return null
		}
		if (!res.success) {
			toast("Something went wrong", {
				description: res?.data?.message || "Unexpected error",
				cancel: {
					label: "Okay",
			    },
			})
		} else {
			router.push(`/${workspace.id}/functions/${res?.data?.id}`)
			toast("Created function", {
				description: "Redirecting you in a moment",
				cancel: {
					label: "Okay",
			    },
			})
		}
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
						<Icon id="code" size="larger" />
					</div>

					<Heading mb="5">
						New edge function
					</Heading>

					<div className="p-4 pt-6 pb-6 border-b-1 border-t-1 border-[var(--gray-a4)] w-full flex flex-col lg:flex-row lg:items-center">
						<div className="flex flex-col gap-1">
							<Text className="lg:min-w-max">Function name</Text>
							<Text size="2" color="gray">
								Can be changed later (Leave empty to generate a random name).
							</Text>
						</div>
						<div className="flex w-full items-center mt-4 lg:mt-0 lg:justify-end">
							<TextField.Root>
								<TextField.Slot>
									<Icon id="grid-3x3" />
								</TextField.Slot>
								<TextField.Input id="functionName" placeholder="Enter function name" />
							</TextField.Root>
						</div>
					</div>

					<div className="p-4 w-full flex items-center justify-end">
						<SubmitButton action={createFunction}>
							<div className="flex items-center gap-1">
								Create function
								<Icon id="chevron-right" />
							</div>
						</SubmitButton>
					</div>

				</div>

			</main>

		</WorkspaceLayout>
	)

}

export default Functions