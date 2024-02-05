"use client"

import Flow from "@/types/flow";
import Workspace from "@/types/workspace";
import Top from "@/components/workspaces/flows/sidepanel/sidePanelTop";
import SideRoutes from "@/components/workspaces/flows/sidepanel/sideRoutes";
import FlowStore from "@/scripts/flows/store";
import Icon from "@/components/Icon";
import { Text } from "@radix-ui/themes";
import MainCanvas from "@/components/workspaces/flows/canvas/main";

export default function ClientStore({ workspace, flow }: { workspace: Workspace, flow: Flow }) {

    const store = new FlowStore({
        flow,
        initNew: true
    });

    return (
        <>
            <div className="sidePanel p-0 pb-14">
                <Top workspace={workspace} flow={flow} />
                <SideRoutes flow={flow} store={store} />
            </div>
            <main className="innerMain overflow-hidden">

                <MainCanvas store={store} />

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