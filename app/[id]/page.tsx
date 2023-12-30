"use client"

import { useEffect } from "react"
import Auth, { type Props } from "@/app/auth/Auth"
import WorkspacePage, { type PageProps } from "./WorkspacePage"
import actions from "./sidebarActions"

import Sidebar from "@/components/layout/Sidebar"
import { InterfaceNav } from "@/components/layout/Navbar"

import { Heading, Text, Button } from "@radix-ui/themes"
import Icon from "@/components/Icon"

// <----/>
const WorkspaceHome = () => ( <Auth Comp={Init} /> )
const Init = ({ user }: Props) => ( <WorkspacePage user={user} Comp={Page} /> )

function Page({ user, workspace }: PageProps) {

	return (
		<>
			<InterfaceNav id={workspace.id} active="home" />

			<Sidebar
				workspace={workspace}
				active="dashboard"
				actions={actions}
			/>

			<main className="innerMain">

				<div className="mainHead">
					<div className="flex flex-col gap-2 min-w-max">
						<Heading size="5">{workspace.name}</Heading>
						<Text color="gray" size="2">Manage your workspace</Text>
					</div>
					<div className="w-full flex items-center justify-end gap-6">
						<PlanButton plan={workspace.plan} />
						<Button variant="surface" color="gray">
							<Icon id="settings" />
						</Button>
					</div>
				</div>

				<UpgradeBanner plan={workspace.plan} />

			</main>
		</>
	)

}

function PlanButton({ plan }: {plan: string}) {

	if (plan === "free"){
		return (
			<Button variant="surface">
				<Icon id="rocket" />
				Upgrade plan
			</Button>
		)
	}

	return (
		<Button variant="surface">
			<Icon id="wallet" />
			Pricing & Usage
		</Button>
	)

}

function UpgradeBanner({ plan }: {plan: string}) {

	if (plan !== "free") {
		return null
	}

	return (
		<div className="upgradeBanner">
			<div className="text-xs text-black">
				You are working on a free testing plan, consider upgrading your workspace soon
			</div>
		</div>
	)

}

export default WorkspaceHome