import Link from "next/link";
import Icon from "@/components/Icon";
import Workspace from "@/types/workspace";
import { Button } from "../ui/button";

export type PathType = {
  title: string;
  path?: string;
};

type Props = {
  workspace: Workspace;
  paths: PathType[];
};

export default function TopPaths({ workspace, paths }: Props) {
  const workspacePath = `/workspaces/${workspace.id}`;

  return (
    <div className="topPath">
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center gap-3">
          <div className="text-[.8rem] opacity-70 hover:opacity-100">
            <Link href={workspacePath}>{workspace.name}</Link>
          </div>
          <Icon id="chevron-right" />
        </div>
        {paths.map((path) => (
          <div key={`path-${path.title}`} className="flex items-center gap-3">
            <div className="text-[.8rem] opacity-70 hover:opacity-100">
              <Link href={`${workspacePath}/${path.path}` || workspacePath}>
                {path.title}
              </Link>
            </div>
            {paths.indexOf(path) < paths.length - 1 && (
              <Icon id="chevron-right" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
