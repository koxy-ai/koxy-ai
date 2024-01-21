"use client"

import SidePanel from "@/components/sidePanel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import Workspace from "@/types/workspace"
import { ReactNode } from "react"

type Props = {
    workspace: Workspace,
    active: string,
    children: ReactNode
}

export default function Resizable({ workspace, active, children }: Props) {

    return (
        <ResizablePanelGroup className="min-w-screen min-h-screen pt-14" direction="horizontal">
            <ResizablePanel defaultSize={24}>
                <SidePanel workspace={workspace} active={active} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={100}>
                <div className="h-full min-h-full max-h-full overflow-auto">
                    {children}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )

}