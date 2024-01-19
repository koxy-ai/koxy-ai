
import { useRouter } from "next/navigation"
import WorkspaceLayout, { type Config } from "@/components/layout/WorkspaceLayout"
import actions from "./sidebarActions"

import Icon from "@/components/Icon"
import WorkspaceHeadInfo from "@/components/layout/WorkspaceHeadInfo"
import FirstTimeFeature from "@/components/layout/FirstTimeFeature"
import Card from "@/components/layout/Card"

import { Button, Heading, Text, TextField, DropdownMenu } from "@radix-ui/themes"

import listFlows, { type FlowType } from "@/app/actions/workspaces/listFlows"
import isArray from "@/scripts/isArray"
import is from "@/scripts/is"
import Link from "next/link"
import getWorkspace from "@/app/actions/workspaces/get"
import FlowsBody from "./new/components/Cards"

export default async function Page({ params }: any) {

	const workspace = await getWorkspace(params?.id)
	const flows: FlowType[] | null = await listFlows(params?.id)

	if (!flows) {
		return null
	}

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
