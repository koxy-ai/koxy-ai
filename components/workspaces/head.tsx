import Workspace from "@/types/workspace";
import DashedBorders from "../DashedBorders";
import Icon from "../Icon";
import { Text, Heading } from "@radix-ui/themes";
import { Button } from "../ui/button";
import { ReactNode } from "react";

type Props = {
  workspace: Workspace;
  title: string;
  description: string;
  icon: string;
  children?: ReactNode;
};

export default function WorkspaceHead({
  workspace,
  title,
  description,
  icon,
  children,
}: Props) {
  return (
    <>
      <div className="flex items-center gap-5 p-5 pb-6 border-b-1 border-border/40">
        <div className="min-w-[3rem] min-h-[3rem] border-1 rounded-lg bg-[#28282828] flex items-center justify-center relative">
          <div
            className="opacity-40"
            style={{
              boxShadow: "0px 0px 30px 10px rgb(107, 93, 239, .8)",
            }}
          >
            <DashedBorders />
          </div>
          <div
            className="flex items-center justify-center text-power"
            style={{
              textShadow: "0px 0px 7px #6B5DEF",
            }}
          >
            <Icon id={icon} size="larger" />
          </div>
        </div>
        <div className="w-full flex flex-col gap-0.5">
          <Heading size="5">{title}</Heading>
          <Text size="2" color="gray">
            {description}
          </Text>
        </div>
        <div className="flex items-center justify-end gap-5">{children}</div>
      </div>
      {workspace.plan === "free" && <UpgradeMessage />}
    </>
  );
}

function UpgradeMessage() {
  return (
    <div className="p-2 w-full flex items-center justify-center text-black border-b-1 text-sm bg-power">
      You are working on a free plan. consider upgrading for more features
    </div>
  );
}
