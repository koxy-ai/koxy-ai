"use client"

import { type SidebarAction } from "@/components/layout/Sidebar"

const actions: Array<SidebarAction> = [
	{
		name: "Dashboard",
		id: "dashboard",
		icon: "layout-dashboard",
		action: (navigate: Function) => ( navigate("/") )
	},
	{
		name: "Tasks",
		id: "tasks",
		icon: "list",
		action: (navigate: Function) => ( navigate("tasks") )
	},
	{
		name: "Team",
		id: "team",
		icon: "users-group",
		action: (navigate: Function) => ( navigate("team") )
	},
	{
		name: "Commands",
		id: "commands",
		icon: "slash",
		action: (navigate: Function) => ( navigate("commands") )
	}
]

export default actions