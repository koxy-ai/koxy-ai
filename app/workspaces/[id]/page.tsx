import getWorkspace from "@/app/actions/workspaces/get"
import Icon from "@/components/Icon"
import SidePanel from "@/components/sidePanel"
import { Button } from "@/components/ui/button"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import Workspace from "@/types/workspace"
import { Text } from "@radix-ui/themes"

export default async function WorkspaceHome({ params }: { params: { id: string } }) {

    const id = params.id;
    const workspace: Workspace = await getWorkspace(id);

    return (
        <>
            <ResizablePanelGroup className="min-w-screen min-h-screen pt-14" direction="horizontal">
                <ResizablePanel defaultSize={20} defaultChecked={true}>
                    <SidePanel workspace={workspace} active="overview" />
                </ResizablePanel>
                <ResizablePanel defaultSize={80} defaultChecked={true}>
                    <main className="h-full"></main>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )

}