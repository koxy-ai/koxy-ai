import getWorkspace from "@/app/actions/workspaces/get"
import Workspace from "@/types/workspace"
import Icon from "@/components/Icon"
import { Text } from "@radix-ui/themes"
import Flow from "@/types/flow"
import ClientStore from "./clientStore"

export const runtime = 'edge';

export default async function WorkspaceHome({ params }: { params: { id: string, flow_id: string } }) {

    const { id, flow_id } = params;
    const workspace: Workspace = await getWorkspace(id);
    const flow: Flow = {
        id: "111",
        name: "this-is-flow",
        status: "111",
        stateUpdated: Date.now(),
        payload: {
            routes: [
                {
                    method: "get",
                    id: "8ry9894r",
                    updatedAt: Date.now(),
                    path: "/hello",
                    code: [
                        {
                            name: "get_now.ts",
                            content: "fff"
                        }
                    ]
                }
            ],
            nodes: []
        }
    }

    return (
        <>

            <div className="sidePanel p-0 pb-14">

                <ClientStore workspace={workspace} flow={flow} />

            </div>

            <main className="innerMain">
                <div className="topPath min-h-[2.5rem]"></div>

                <div className="bottomPath">
                    <div className="flex items-center gap-1 bg-accent/20 border-r-1 border-border/40 cursor-default hover:bg-accent/40 pl-2 pr-2 min-h-full">
                        <Icon id="terminal" size="small" options={{ color: "gray" }} />
                        <Text size="1">console</Text>
                    </div>
                </div>

            </main>
        </>
    )

}