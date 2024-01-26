import getWorkspace from "@/app/actions/workspaces/get"
import SidePanel from "@/components/sidePanel"
import Workspace from "@/types/workspace"
import TopPaths, { PathType } from "@/components/workspaces/topPaths"
import WorkspaceHead from "@/components/workspaces/head"
import { Button } from "@/components/ui/button"
import Icon from "@/components/Icon"
import listFlows from "@/app/actions/workspaces/listFlows"
import FlowsCards from "./cards"
import Link from "next/link"

export default async function WorkspaceHome({ params }: { params: { id: string } }) {

    const id = params.id;
    const workspace: Workspace = await getWorkspace(id);
    const flows = await listFlows(workspace.id);

    const paths: PathType[] = [
        {
            title: "Flows",
            path: "flows"
        }
    ];

    return (
        <>
            <SidePanel workspace={workspace} active="api flows" />
            <main className="innerMain">
                <TopPaths workspace={workspace} paths={paths} />
                <div className="pt-14">

                    <WorkspaceHead
                        workspace={workspace}
                        title="Flows"
                        icon="route"
                        description="Serverless API flows"
                    >
                        <>
                            <Button variant="outline2" size="sm">
                                <Icon id="book" />
                                Docs
                            </Button>
                            <Link href="flows/new">
                                <Button variant="power" size="sm">
                                    <Icon id="plus" />
                                    New flows
                                </Button>
                            </Link>
                        </>
                    </WorkspaceHead>

                    <div className="p-5 flex w-full">
                        <FlowsCards flows={flows} />
                    </div>

                </div>
            </main>
        </>
    )

}