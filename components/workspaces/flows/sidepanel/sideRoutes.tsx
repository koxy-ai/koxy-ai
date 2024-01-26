"use client"

import Icon from "@/components/Icon";
import { Text, Badge, IconButton } from "@radix-ui/themes";
import { MouseEventHandler, ReactNode, useState } from "react";
import Flow, { RouteCode } from "@/types/flow";
import FlowStore from "@/scripts/flows/store";
import { OptionsRoot, RouteOptions } from "./routeOptions";
import { Route } from "@/types/flow";

export default function SideRoutes({ flow, store }: { flow: Flow, store: FlowStore }) {

    const routes = flow?.payload?.routes || [];

    return (
        <>

            <div className="flex items-center border-border/40 p-5 pt-3 pb-3 gap-2 mt-2 mb-1">
                <div className="flex items-center justify-center cursor-pointer pl-0.5 opacity-60 hover:opacity-100">
                    <Icon id="plus" size="small" />
                </div>
                <div className="flex items-center gap-2 ml-1">
                    <Icon id="search" options={{ color: "gray" }} size="small" />
                    <input
                        className="text-xs bg-transparent outline-0 border-0 opacity-70 focus:opacity-100 mt-0.5"
                        placeholder="Search routes..."
                    />
                </div>
            </div>

            {routes.map(route => (
                <div key={`${route.path}-${route.method}`}>
                    <Route route={route} store={store} />
                </div>
            ))}

        </>
    )

}

function Route({ route, store }: { route: Route, store: FlowStore }) {

    const { method, path } = route;
    const [open, setOpen] = useState<boolean>(false);

    const toggleOpen = () => {
        console.log("toggeling")
        setOpen((open) ? false : true);
    }

    if (!open) {
        return (
            <ClosedRoute onClick={() => toggleOpen()}>
                <>
                    <div className="flex items-center gap-2 w-full">
                        <Icon id="chevron-right" options={{ color: "gray" }} />
                        <Icon id="folder" options={{ color: "gray" }} />
                        <Text color="gray" size="2">{path}</Text>
                    </div>
                    <Method method={method} />
                    <RouteOptions route={route} store={store} />
                </>
            </ClosedRoute>
        )
    }

    return (
        <>
            <OpenRoute onClick={() => toggleOpen()}>
                <>
                    <div className="flex items-center gap-2 w-full">
                        <Icon id="chevron-down" options={{ color: "gray" }} />
                        <Icon id="folder-open" options={{ color: "gray" }} />
                        <Text size="2">{path}</Text>
                    </div>
                    <Method method={method} />
                    <RouteOptions route={route} store={store} />
                </>
            </OpenRoute>
            <SubRoute>
                <>
                    <SubItem title="map" icon="route-2" />
                    <SubItem title="variables" icon="variable" />
                    <SubItem title="types" icon="file-type-ts" />
                    <CodeFolder files={route.code} />
                </>
            </SubRoute>
        </>
    )

}

function ClosedRoute({ children, onClick }: { children: ReactNode, onClick: MouseEventHandler }) {

    return (
        <OptionsRoot>
            <div onClick={onClick} className="closedRoute">
                {children}
            </div>
        </OptionsRoot>
    )

}

function OpenRoute({ children, onClick }: { children: ReactNode, onClick: MouseEventHandler }) {

    return (
        <OptionsRoot>
            <div onClick={onClick} className="openRoute">
                {children}
            </div>
        </OptionsRoot>
    )

}

function Method({ method }: { method: string }) {

    const methods: Record<string, string> = {
        get: "green",
        post: "orange",
        put: "blue",
        patch: "purple",
        delete: "red",
        head: "grass",
        options: "pink"
    };

    const color = methods[method];

    return <Badge color={color as any}>{method}</Badge>

}

function SubRoute({ children }: { children: ReactNode }) {

    return (
        <div className="pl-7 pr-0 bg-[#19191919]">
            <div className="border-l-1 border-border/30 flex flex-col">
                {children}
            </div>
        </div>
    )

}

function SubItem({ title, icon, color }: { title: string, icon: string, color?: string }) {

    color = color || "gray";

    return (
        <button className="flex items-center w-full gap-2 p-1.5 pr-5 cursor-pointer hover:bg-[#26262626]">
            <div className="flex items-center gap-2 w-full pl-2">
                <Icon id={icon} options={{ color }} />
                <Text color="gray" size="2">{title}</Text>
            </div>
        </button>
    )

}

function CodeFolder({ files }: { files: RouteCode[] }) {

    const [open, setOpen] = useState<boolean>(false);

    const toggleOpen = () => {
        setOpen((open) ? false : true);
    }

    if (!open) {
        return (
            <div onClick={() => toggleOpen()} className="closedRoute pl-3.5">
                <div className="flex items-center gap-2 w-full">
                    <Icon id="chevron-right" options={{ color: "gray" }} />
                    <Icon id="folder" options={{ color: "gray" }} />
                    <Text color="gray" size="2">code</Text>
                </div>
            </div>
        )
    }

    return (
        <>
            <div onClick={() => toggleOpen()} className="openRoute pl-3.5">
                <div className="flex items-center gap-2 w-full">
                    <Icon id="chevron-down" options={{ color: "gray" }} />
                    <Icon id="folder-open" options={{ color: "gray" }} />
                    <Text size="2">code</Text>
                </div>
            </div>
            <div className="pl-5 pr-0 bg-[#19191919]">
                <div className="border-l-1 border-border/30 flex flex-col">
                    {files.map(file => (
                        <div key={`${file.name}-${Date.now()}`} className="w-full">
                            <SubItem title={file.name} icon="brand-deno" color="var(--power)" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )

}