import Link from "next/link"
import Icon from "@/components/Icon"
import Workspace from "@/types/workspace"
import { Button } from "../ui/button"

export type PathType = {
    title: string,
    path?: string
}

type Props = {
    workspace: Workspace,
    paths: PathType[],
}

export default function TopPaths({ workspace, paths }: Props) {

    const workspacePath = `/workspaces/${workspace.id}`;

    return (
        <div className="flex fixed top-14 left-64 pr-64 w-full bg-accent/20 z-20 backdrop-blur-xl items-center gap-3 border-b-1 min-h-[3.2rem] pl-5 pr-5 border-border/50 text-foreground/70">
            <div className="flex items-center gap-3 w-full">
                <div className="flex items-center gap-3">
                    <div className="text-[.8rem] opacity-70 hover:opacity-100">
                        <Link href={workspacePath}>{workspace.name}</Link>
                    </div>
                    <Icon id="chevron-right" />
                </div>
                {paths.map(path => (
                    <div key={`path-${path.title}`} className="flex items-center gap-3">
                        <div className="text-[.8rem] opacity-70 hover:opacity-100">
                            <Link href={`${workspacePath}/${path.path}` || workspacePath}>{path.title}</Link>
                        </div>
                        {paths.indexOf(path) < (paths.length - 1) && <Icon id="chevron-right" />}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-5 pr-5 min-w-max">
                <Button variant="outline" size="xs">
                    <Icon id="code" />
                    API Docs
                </Button>
            </div>
        </div>
    )

}