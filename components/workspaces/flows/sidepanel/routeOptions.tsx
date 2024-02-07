import Icon from "@/components/Icon";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import FlowStore from "@/scripts/flows/store";
import { Route } from "@/types/flow";
import { ReactNode } from "react";

export function OptionsRoot({
  children,
  store,
  route,
}: {
  children: ReactNode;
  store: FlowStore;
  route: Route;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => store.events.push("openMethodAdd", route)}
        >
          <Option title="Add method" icon="plus" />
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => store.events.push("openRouteEditor", route)}
        >
          <Option title="Rename route" icon="edit" />
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => store.events.push("openRouteDelete", route)}
        >
          <Option title="Delete" icon="trash" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function Option({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 text-xs mr-2">
      <Icon id={icon} size="small" options={{ color: "gray" }} />
      {title}
    </div>
  );
}
