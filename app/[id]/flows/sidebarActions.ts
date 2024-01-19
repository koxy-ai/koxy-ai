"use client"

import { type SidebarAction } from "@/components/layout/Sidebar"

const actions: Array<SidebarAction> = [
	{
		name: "Your flows",
		id: "your-flows",
		icon: "route",
		action: (navigate: Function) => ( navigate("functions/") )
	},
	{
		name: "New flow",
		id: "new-flow",
		icon: "plus",
		action: (navigate: Function) => ( navigate("flows/new") )
	},
	{
		name: "API runner",
		id: "api-runner",
		icon: "microscope",
		action: (navigate: Function) => ( navigate("team") )
	}
]

export default actions