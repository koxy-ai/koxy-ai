"use client"

import Flow from "@/types/flow";
import Workspace from "@/types/workspace";
import Top from "@/components/workspaces/flows/sidepanel/sidePanelTop";
import SideRoutes from "@/components/workspaces/flows/sidepanel/sideRoutes";
import FlowStore from "@/scripts/flows/store";

export default function ClientStore({ workspace, flow }: { workspace: Workspace, flow: Flow }) {

    const store = new FlowStore({
        flow,
        initNew: true
    });

    return (
        <>
            <Top workspace={workspace} flow={flow} />
            <SideRoutes flow={flow} store={store} />
        </>
    )

}