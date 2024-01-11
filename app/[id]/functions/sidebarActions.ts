"use client"

import { type SidebarAction } from "@/components/layout/Sidebar"

const actions: Array<SidebarAction> = [
	{
		name: "Your functions",
		id: "your-functions",
		icon: "code",
		action: (navigate: Function) => ( navigate("functions/") )
	},
	{
		name: "New function",
		id: "new-function",
		icon: "plus",
		action: (navigate: Function) => ( navigate("functions/new") )
	},
	{
		name: "Test ground",
		id: "function-runner",
		icon: "microscope",
		action: (navigate: Function) => ( navigate("team") )
	}
]

export default actions