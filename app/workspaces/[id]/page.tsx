import getWorkspace from "@/app/actions/workspaces/get"
import SidePanel from "@/components/sidePanel"
import Workspace from "@/types/workspace"
import TopPaths, { PathType } from "@/components/workspaces/topPaths"
import WorkspaceHead from "@/components/workspaces/head"
import { Button } from "@/components/ui/button"
import Icon from "@/components/Icon"

export const runtime = 'edge';

export default async function WorkspaceHome({ params }: { params: { id: string } }) {

    const id = params.id;
    const workspace: Workspace = await getWorkspace(id);

    const paths: PathType[] = [
        {
            title: "Overview"
        }
    ];

    return (
        <>
            <SidePanel workspace={workspace} active="overview" />
            <main className="innerMain">
                <TopPaths workspace={workspace} paths={paths} />
                <div className="pt-14">
                    <WorkspaceHead
                        workspace={workspace}
                        title="Overview"
                        icon="layout"
                        description="Manage your workspace"
                    >
                        <>
                            <Button variant="outline2" size="sm">
                                <Icon id="users-group" />
                                Manage team
                            </Button>
                            <Button variant="power" size="sm">
                                <Icon id="users-group" />
                                Manage team
                            </Button>
                        </>
                    </WorkspaceHead>
                    <div className="p-5">

                    </div>
                </div>
            </main>
        </>
    )

}

