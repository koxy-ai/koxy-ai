"use client"

import { type SidebarAction } from "@/components/layout/Sidebar"

const actions: Array<SidebarAction> = [
	{
		name: "Your models",
		id: "your_models",
		icon: "robot",
		action: (navigate: Function) => ( navigate("models/") )
	},
	{
		name: "Find models",
		id: "find_models",
		icon: "search",
		action: (navigate: Function) => ( navigate("models/find") )
	},
	{
		name: "Playground",
		id: "models_playground",
		icon: "terminal",
		action: (navigate: Function) => ( navigate("models/playground") )
	},
	{
		name: "Pricing & Usage",
		id: "models_pricing",
		icon: "chart-area",
		action: (navigate: Function) => ( navigate("models/usage") )
	}
]

export default actions