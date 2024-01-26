import Icon from "@/components/Icon";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import FlowStore from "@/scripts/flows/store";
import { Route } from "@/types/flow";
import { ReactNode } from "react";

export function OptionsRoot({ children }: { children: ReactNode }) {

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                {children}
            </ContextMenuTrigger>
        </ContextMenu>
    )

}

export function RouteOptions({ route, store }: { route: Route, store: FlowStore }) {

    const editPath = () => {

    }

    return (
        <ContextMenuContent>
            <ContextMenuItem>
                <Option title="Change path" icon="edit" />
            </ContextMenuItem>
            <ContextMenuItem>
                <Option title="Change method" icon="tool" />
            </ContextMenuItem>
            <ContextMenuItem>
                <Option title="Delete" icon="trash" />
            </ContextMenuItem>
        </ContextMenuContent>
    )

}

export function Option({ title, icon }: { title: string, icon: string }) {
    return (
        <div className="flex items-center gap-2 text-xs mr-2">
            <Icon id={icon} size="small" options={{ color: "gray" }} />
            {title}
        </div>
    )
}