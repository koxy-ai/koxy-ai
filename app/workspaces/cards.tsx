"use client"

import { IconButton, Text, DropdownMenu } from "@radix-ui/themes"
import Workspace from "@/types/workspace"
import Icon from "@/components/Icon"
import Link from "next/link"

export default function Cards({ workspaces }: { workspaces: Workspace[] }) {

    const imgSrc = "https://api.dicebear.com/7.x/identicon/svg?seed=";

    return (
        <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex gap-5">
            {workspaces.map(workspace => (
                <div key={`workspaceCard-${workspace?.id}`} className="p-5 border-1 rounded-xl cursor-pointer hover:bg-[#28282828] relative">
                    <Link href={`/workspaces/${workspace.id}`} className="flex flex-col gap-3">
                        <img src={`${imgSrc}${workspace.id}`} className="w-10 border-1 rounded-lg p-2" />
                        <div className="flex flex-col gap-0.5 mt-1">
                            <Text className="font-semibold opacity-90" size="3">{workspace.name}</Text>
                            <Text size="2" color="gray" className="flex items-center gap-1">
                                {workspace?.id.split("-")[0]}
                                <Icon id="point-filled" size="small" />
                                {workspace?.plan} workspace</Text>
                        </div>
                    </Link>

                    <div className="absolute top-4 right-4">
                        <DropdownMenu.Root>

                            <DropdownMenu.Trigger>
                                <IconButton className="hover:bg-accent focus:bg-accent" variant="ghost" color="gray">
                                    <Icon id="dots" />
                                </IconButton>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Content variant="soft" className="dropMenu min-w-[9rem]">
                                <MenuOption icon="layout" title="Overview" path={`/workspaces/${workspace.id}/`} />
                                <DropdownMenu.Separator />

                                <DropdownMenu.Sub>
                                    <DropdownMenu.SubTrigger>
                                        <div className="flex items-center gap-2 text-foreground/80">
                                            <Icon id="link" size="14px" /> Domains
                                        </div>
                                    </DropdownMenu.SubTrigger>
                                    <DropdownMenu.SubContent className="bg-black">
                                        <MenuOption icon="link" title="All domains" path={`/workspaces/${workspace.id}/domains`} />
                                        <MenuOption icon="plus" title="Connect domain..." path={`/workspaces/${workspace.id}/domains/new`} />
                                    </DropdownMenu.SubContent>
                                </DropdownMenu.Sub>

                                <MenuOption icon="database" title="Databases" path={`/workspaces/${workspace.id}/databases`} />
                                <DropdownMenu.Separator />
                                <MenuOption icon="settings" title="Settings" path={`/workspaces/${workspace.id}/settings`} />
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>

                </div>
            ))}

        </div>
    )

}

function MenuOption({ icon, title, path }: { icon: string, title: string, path: string }) {

    return (
        <Link href={path}>
            <DropdownMenu.Item>
                <div className="flex items-center gap-2 text-foreground/80">
                    <Icon id={icon} size="14px" /> {title}
                </div>
            </DropdownMenu.Item>
        </Link>
    )

}