"use client"

import { type SidebarAction } from "@/components/layout/Sidebar"

function createActions(funcId: string) {

	const createPath = (path: string) => ( `functions/${funcId}${path}` )

	const actions: Array<SidebarAction> = [
		{
			name: "Overview",
			id: "function-overview",
			icon: "layout-dashboard",
			action: (navigate: Function) => ( navigate(`${createPath("/")}`) )
		},
		{
			name: "Deployments",
			id: "function-deployments",
			icon: "versions",
			action: (navigate: Function) => ( navigate(`${createPath("/deployments")}`) )
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
			action: (navigate: Function) => ( navigate(`${createPath("/settings")}`) )
		},
		{
			name: "Your functions",
			id: "your-functions",
			icon: "chevron-left",
			action: (navigate: Function) => ( navigate("functions/") )
		}
	]

	return actions

}

export default createActions