"use client";

import Icon from "@/components/Icon";
import Workspace from "@/types/workspace";
import { Text } from "@radix-ui/themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Top({
  workspace,
  flow,
}: {
  workspace: Workspace;
  flow: any;
}) {
  return (
    <div className="sidePanelTop gap-0 border-0 flex-col justify-center min-h-max pt-4">
      <div className="border-1 border-border/40 rounded-lg w-full flex flex-col bg-accent/30">
        <div className="p-2 flex items-center gap-2 cursor-pointer transition-all hover:bg-[#21212121]">
          <Icon id="package" options={{ color: "gray" }} />
          <Text size="2">{workspace.name}</Text>
          <Icon id="arrow-back" options={{ color: "gray" }} />
        </div>
        <div className="border-t-1 w-full border-border/40"></div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="p-2 flex items-center gap-2 cursor-pointer transition-all hover:bg-[#21212121]">
              <Icon id="route" options={{ color: "gray" }} />
              <Text size="2">{flow.name}</Text>
              <Icon id="chevron-down" options={{ color: "gray" }} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownItem title="Deployments" icon="versions" />
            <DropdownItem title="Settings" icon="settings" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function DropdownItem({ title, icon }: { title: string; icon: string }) {
  return (
    <DropdownMenuItem>
      <div className="flex items-center gap-2 opacity-80 text-xs">
        <Icon id={icon} options={{ color: "gray" }} />
        {title}
      </div>
    </DropdownMenuItem>
  );
}
