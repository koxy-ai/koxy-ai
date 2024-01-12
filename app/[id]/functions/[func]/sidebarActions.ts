"use client"

import { type SidebarAction } from "@/components/layout/Sidebar"

const actions: Array<SidebarAction> = [
	{
		name: "Overview",
		id: "function-overview",
		icon: "layout-dashboard",
		action: (navigate: Function) => ( navigate("functions/") )
	},
	{
		name: "Deployments",
		id: "function-deployments",
		icon: "versions",
		action: (navigate: Function) => ( navigate("functions/new") )
	},
	{
		name: "Logs",
		id: "function-logs",
		icon: "list-details",
		action: (navigate: Function) => ( navigate("team") )
	},
	{
		name: "Analytics",
		id: "function-analytics",
		icon: "chart-area",
		action: (navigate: Function) => ( navigate("team") )
	},
	{
		name: "Settings",
		id: "function-settings",
		icon: "settings-code",
		action: (navigate: Function) => ( navigate("team") )
	},
	{
		name: "Your functions",
		id: "your-functions",
		icon: "chevron-left",
		action: (navigate: Function) => ( navigate("functions/") )
	}
]

export default actions