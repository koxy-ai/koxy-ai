"use client"

import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge, Button as RadixButton } from "@radix-ui/themes";
import Item from "./Item";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

export function toggleMainCommands() {
    const elm = document.getElementById("mainCommandsButton");
    if (!elm) {
        return null;
    }
    elm.click();
}

export default function MainCommands({ children }: { children?: ReactNode }) {

    const [open, setOpen] = useState<boolean | undefined>(false);
    const [navigations, setNavigations] = useState<HTMLElement[]>([])

    const toggleState = () => {
        setOpen((open) => !open);
    }

    const down = (e: KeyboardEvent) => {
        if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            toggleState()
        }
        if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();

        }
    }

    useEffect(() => {
        const navElms = document.getElementsByClassName("navigationLink");
        const navArray = []

        for (const index in navElms) {
            const nav = navElms[index]
            navArray.push(nav as HTMLElement)
        }

        setNavigations(navArray)

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [])

    return (
        <>
            <Button
                id="mainCommandsButton"
                onClick={toggleState}
                className="h-8 w-[50%] justify-start pl-2 pr-2 gap-2 rounded-[.5rem]"
                size="icon"
                variant="outline"
            >
                <div className="text-[.8rem] opacity-70 leading-7">Command Menu...</div>
                <div className="w-full flex items-center justify-end gap-2">
                    <Badge>⌘ + /</Badge>
                </div>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput id="mainCommandsInput" placeholder="Type a command or search..." />
                <CommandList className="p-1">
                    <CommandEmpty>No commands found.</CommandEmpty>

                    <CommandGroup heading="Workspaces">
                        <Item icon="layout-2" title="Search workspaces..." />
                        <Item icon="plus" title="Create new workspace..." />
                    </CommandGroup>

                    <CommandGroup heading="Navigation">
                        {navigations && navigations.map(nav => (
                            nav?.innerText && <div key={`mainNav-${nav?.id}`}>
                                <Item
                                    title={nav?.innerText}
                                    icon="chevron-right"
                                    action={() => {
                                        toggleState();
                                        nav.click();
                                    }}
                                />
                            </div>
                        ))}
                    </CommandGroup>

                    <CommandGroup heading="General">
                        <Item icon="copy" title="Copy current URL" />
                        <Item icon="copy-plus" title="Duplicate window" shortcut="⌘ + D" />
                    </CommandGroup>

                    <CommandGroup heading="Account">
                        <Item icon="settings" title="Settings" />
                        <Item icon="logout" title="Log out" />
                    </CommandGroup>

                </CommandList>
            </CommandDialog>

        </>
    )

}

