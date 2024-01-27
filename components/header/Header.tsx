"use client"

import { type ReactNode } from "react";
import MainCommands from "../global/commands/Main";
import { Button } from "../ui/button";
import Icon from "../Icon";
import TopAvatar from "./Avatar";
import { User } from "@supabase/auth-helpers-nextjs";
import HeadLink, { LinkType } from "./HeadLink";

type Props = {
    user: User,
    children?: ReactNode,
    links: LinkType[],
    activeLink?: string,
}

export default function Header({ user, links, children, activeLink }: Props) {

    activeLink = activeLink || "NAN";

    return (
        <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 flex items-center h-14 pl-5 pr-5">
            <div className="flex items-center gap-1 mr-9 min-w-max">
                <img src="/koxy-latest.png" className="w-[6.5rem]" />
            </div>

            <div className="linksFlex">
                {links.map(link => (
                    <div key={`link-${link.title}`}>
                        <HeadLink 
                            active={link?.active || (link.title.toLowerCase() === activeLink?.toLowerCase()) || false}
                            title={link?.title} 
                            path={link?.path} 
                        />
                    </div>
                ))}
                {children && children}
            </div>

            <MainCommands />

            <div className="headRight">
                <Button className="w-8 h-8 opacity-70 hover:opacity-100" size="icon" variant="outline">
                    <Icon id="bell" size="18px" />
                </Button>
                <TopAvatar user={user} />
            </div>
        </header>

    )

}