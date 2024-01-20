"use client"

import Icon from "@/components/Icon"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge, DropdownMenu } from "@radix-ui/themes"
import { type User } from "@supabase/auth-helpers-nextjs"
import { toggleMainCommands } from "../global/commands/Main"

export default function TopAvatar({ user }: { user: User }) {

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <button className="rounded-full">
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback>{user?.email?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
                variant="soft"
                color="gray"
                style={{
                    backgroundColor: "rgba(16, 16, 16, 0.7)",
                    backdropFilter: "blur(15px)",
                    minWidth: "13rem",
                    borderColor: "var(--border)"
                }}
            >
                <div className="mb-2">
                    <DropdownMenu.Label className="truncate">
                        {user?.user_metadata?.name || user?.email}
                    </DropdownMenu.Label>
                </div>
                <div className="flex flex-col gap-2">
                    <DropdownMenu.Item color="gray">
                        Account settings
                        <Icon id="settings" />
                    </DropdownMenu.Item>
                    <DropdownMenu.Item color="gray">
                        Create workspace
                        <Icon id="plus" />
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onClick={toggleMainCommands} color="gray">
                        Command menu
                        <Badge>⌘ + /</Badge>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator></DropdownMenu.Separator>

                    <DropdownMenu.Item color="gray">
                        Koxy Homepage
                        <Icon id="external-link" />
                    </DropdownMenu.Item>
                    <DropdownMenu.Item color="gray">
                        Log out
                        <Icon id="logout" />
                    </DropdownMenu.Item>
                </div>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )

}
