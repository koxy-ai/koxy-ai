import Link from "next/link";

export type LinkType = {
    title: string,
    path: string,
    active?: boolean,
    target?: string
}

export function defaultLinks(): LinkType[] {

    return [
        {
            title: "Workspaces",
            path: "/workspaces",
        },
        {
            title: "Docs",
            path: "/docs"
        },
        {
            title: "Pricing",
            path: "/pricing"
        },
        {
            title: "Resources",
            path: "/resources"
        }
    ]

}

export default function HeadLink({ title, path, target, active }: LinkType) {

    return (
        <Link
            id={`${title.toLocaleLowerCase()}-headLink`}
            href={path} target={target || "_self"}
            className={`navigationLink ${(!active) && "opacity-70"} hover:opacity-100 transition-all`}
        >
            <div className="text-[.835rem] leading-7">{title}</div>
        </Link>
    )

}