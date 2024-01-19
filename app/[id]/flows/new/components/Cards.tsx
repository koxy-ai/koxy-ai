"use client"

import { FlowType } from "@/app/actions/workspaces/listFlows"
import FirstTimeFeature from "@/components/layout/FirstTimeFeature"
import is from "@/scripts/is"
import { DropdownMenu } from "@radix-ui/themes"
import { useRouter } from "next/navigation"

export default function FlowsBody({ flows }: { flows: FlowType[] }) {

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
                action: () => {
                    
                }
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
				{/* <TextField.Root>
					<TextField.Slot>
						<Icon id="search" />
					</TextField.Slot>
					<TextField.Input id="functionsSearch" placeholder="Search function by name" />
				</TextField.Root> */}
			</div>

			<div className="flex items-center gap-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
				{flows.map(functionItem => (
					<div 
						key={functionItem.id}
						className="functionItem"
						id={functionItem.name.replace(" ", "-").toLowerCase()}
					>
						{/* <Card
							title={functionItem.name}
							info={functionItem.id}
							icon={functionItem.status === "progressing" ? "loader" : "code"}
							action={() => router.push(`flows/${functionItem.id}`)}
							Options={() => {
								return (
									<FuncOptions functionItem={functionItem} />
								)
							}}
						/> */}
					</div>
				))}
			</div>

		</div>
	)

}

const FuncOptions = ({ functionItem }: { functionItem: FlowType }) => {

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
		<DropdownMenu.Item color={color || "gray"} >{title}</DropdownMenu.Item>
	)
}