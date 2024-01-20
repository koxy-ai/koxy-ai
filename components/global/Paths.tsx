"use client"

import { Text } from "@radix-ui/themes"
import { User } from "@supabase/auth-helpers-nextjs"
import { usePathname } from "next/navigation"
import Icon from "../Icon";

export default function Paths({ user }: { user: User }) {

    const items: string[] = usePathname().split("/");
    items.filter((value: string) => value !== location.origin);
    // const items = path.slice(1, (path.length - 1));

    return (
        <div className="flex items-center gap-3 pb-3 text-foreground/50">
            <Text color="gray" size="2">{user?.user_metadata?.name || user?.email?.split("@")[0]}</Text>
            {items.map(item => (
                (items.indexOf(item) === (items.length - 1))
                    ? <Text className="text-white" size="2">{item}</Text>
                    : <div className="flex">
                        <Text color="gray" size="2">{item}</Text>
                        <Icon id="chevron-right" />
                    </div>
            ))}
        </div>
    )

}