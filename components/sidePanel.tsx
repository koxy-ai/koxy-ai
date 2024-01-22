"use client"

import Link from "next/link";
import Icon from "./Icon";
import { Text } from "@radix-ui/themes";
import Workspace from "@/types/workspace";

type ItemProps = {
    icon: string,
    title: string,
    path: string,
    workspaceName: string,
    active: string
}

const mainActions = [
    {
        icon: "layout",
        title: "Overview",
        path: "/",
    },
    {
        icon: "vector",
        title: "Models",
        path: "/models",
    },
    {
        icon: "route",
        title: "Flows",
        path: "/flows"
    },
    {
        icon: "cloud-code",
        title: "Edge functions",
        path: "/functions"
    },
    {
        icon: "database",
        title: "Databases",
        path: "/databases"
    },
    {
        icon: "click",
        title: "Realtime",
        path: "/realtime"
    }
]

const secondActions = [
    {
        icon: "users-group",
        title: "Team members",
        path: "/team"
    },
    {
        icon: "settings",
        title: "Settings",
        path: "/settings"
    }
]

export default function SidePanel({ workspace, active }: { workspace: Workspace, active: string }) {

    const id = workspace.id;
    const buildPath = (path: string) => `/workspaces/${id}${path}`;

    return (
        <div className="sidePanel">

            <div className="flex items-center gap-2 w-full min-h-[3.2rem] pl-5 pr-5 border-b-1 border-border/50">
                <div className="flex items-center gap-2 w-full truncate">
                    <div className="w-7 h-7 flex items-center justify-center border-1 rounded-lg font-semibold buttonGradient">
                        <div className="text-xs">
                            {workspace?.name.substring(0, 1)}
                        </div>
                    </div>
                    <Text color="gray" size="2">{workspace.name}</Text>
                </div>
                <div className="w-6 h-6 bg-accent/50 rounded-md flex items-center justify-center">
                    <Icon id="selector" />
                </div>
            </div>

            <div className="h-full flex flex-col gap-5 p-5">
                {mainActions.map(action => (
                    <div key={`panelAction-${action.title}`}>
                        <Item
                            workspaceName={workspace.name}
                            icon={action.icon}
                            title={action.title}
                            path={buildPath(action.path)}
                            active={active}
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-5 p-5">
                {secondActions.map(action => (
                    <div key={`panelAction-${action.title}`}>
                        <Item
                            workspaceName={workspace.name}
                            icon={action.icon}
                            title={action.title}
                            path={buildPath(action.path)}
                            active={active}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

}

function Item({ icon, title, path, active, workspaceName }: ItemProps) {

    const isActive = (active === title.toLocaleLowerCase());

    return (
        <Link href={path} className={`sidebarButton navigationLink relative ${isActive && "bg-accent/40"}`}>
            <div className="flex items-center gap-2 w-full">
                <div className={`sidebarButtonIcon ${isActive && "text-power"}`}>
                    <Icon id={icon} />
                </div>
                <Text className="scale-0 absolute">{`${workspaceName} -> `}</Text>
                <Text>{title}</Text>
            </div>
        </Link>
    )
}