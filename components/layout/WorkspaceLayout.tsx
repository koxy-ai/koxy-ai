"use client"

import {
  	ResizableHandle,
  	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable"

import React from "react"
import Sidebar, { type SidebarAction } from "@/components/layout/Sidebar"
import { InterfaceNav } from "@/components/layout/Navbar"
import { type User } from "@supabase/auth-helpers-nextjs"

export type Config = {
	workspace: any,
	navbar: {
		active: string
	},
	sidebar: {
		actions: Array<SidebarAction>,
		active: string
	}
}

export default function WorkspaceLayout({ config, children }: { config: Config, children: React.JSX.Element }) {

	return (
		<>
			
			<InterfaceNav id={config?.workspace?.id} active={config?.navbar?.active} />
			<ResizablePanelGroup className="min-w-screen pl-14" direction="horizontal">

				<ResizablePanel defaultSize={25}>
					<Sidebar
						workspace={config?.workspace}
						actions={config?.sidebar?.actions}
						active={config?.sidebar?.active}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={100}>
					{children}
				</ResizablePanel>
			</ResizablePanelGroup>

		</>
	)

}