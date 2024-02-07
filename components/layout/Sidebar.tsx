"use client";

import Icon from "../Icon";
import { Dialog, Text, Badge } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import is from "@/scripts/is";
import getAllWorkspaces from "@/app/actions/workspaces/getAll";

export type SidebarAction = {
  name: string;
  id: string;
  icon: string;
  action: Function;
};

type Props = {
  workspace: any;
  active: string;
  actions: Array<SidebarAction>;
};

export default function SideBar({ workspace, active, actions }: Props) {
  const id = workspace.id;
  const name = workspace.name;
  const router = useRouter();

  useEffect(() => {
    is([active, "string"], (active: string) => {
      const elm = document.getElementById(active);

      is([elm, "object"], (elm: HTMLElement) => {
        elm.style.background = "#31313131";
      });
    });
  }, []);

  const sideBarNavigate = (path: string) => {
    router.push(`/${id}/${path}`);
  };

  // We want to perform the sidebar actions using this function so we pass it the navigator
  const performAction = (action: Function) => {
    action(sideBarNavigate);
  };

  return (
    <div className="sidebar">
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="w-full min-h-[3.3rem] border-b-1 border-[var(--gray-a4)] flex items-center group pl-4 pr-4 text-xs transition-all">
            <button className="sidebarButton hover:bg-transparent group truncate">
              <div className="w-full flex items-center gap-1 min-w-max">
                <div className="w-6 h-6 border-1 border-[var(--gray-a9)] rounded-md mr-1 flex items-center justify-center bg-black">
                  <Icon id="box" />
                </div>
                <div className="truncate">{name}</div>
              </div>
            </button>
            <div className="p-1 bg-[#31313131] flex items-center justify-center rounded-md group-hover:bg-[#41414141] transition-all cursor-pointer">
              <Icon id="selector" />
            </div>
          </div>
        </Dialog.Trigger>
        <WorkspacesDialog router={router} workspace={workspace} />
      </Dialog.Root>

      <div className="p-4 flex flex-col h-full gap-4">
        {actions.map((item) => (
          <button
            onClick={() => {
              performAction(item.action);
            }}
            key={item.id}
            id={item.id}
            className="sidebarButton shadowText"
          >
            <div className="sidebarButtonIcon">
              <Icon id={item.icon} />
            </div>
            {item.name}
          </button>
        ))}
        <div className="h-full"></div>
        <button className="sidebarButton">
          <div className="flex items-center gap-2 w-full">
            <div className="sidebarButtonIcon">
              <Icon id="slash" />
            </div>
            <Text>Commands</Text>
          </div>
          <Badge color="gray" variant="soft">
            /
          </Badge>
        </button>
        <button className="sidebarButton">
          <div className="flex items-center gap-2 w-full">
            <div className="sidebarButtonIcon">
              <Icon id="book" />
            </div>
            <Text>Documentation</Text>
          </div>
          <Badge color="gray" variant="soft">
            ctrl
          </Badge>
          <Badge color="gray" variant="soft">
            d
          </Badge>
        </button>
      </div>
    </div>
  );
}

const memWorkspaces: { value: null | Array<any> } = {
  value: null,
};

function WorkspacesDialog({
  workspace,
  router,
}: {
  workspace: any;
  router: any;
}) {
  const [workspaces, setWorkspaces] = useState<null | Array<any>>(
    memWorkspaces.value,
  );

  const actions = [
    {
      name: "Create workspace",
      icon: "plus",
      link: "/new-workspace",
      shortcut: "alt+c",
    },
    {
      name: "Join workspace",
      icon: "arrow-back-up",
      link: "/new-workspace",
      shortcut: "alt+j",
    },
    {
      name: "Accout settings",
      icon: "user",
      link: "/new-workspace",
      shortcut: "alt+a",
    },
  ];

  const searchWorkspaces = () => {
    const elm = document.getElementById("searchWorkspacesInput");
    const elements = document.getElementsByClassName("workspaceElm");

    is([elm, "object"], (elm: HTMLInputElement) => {
      let value = elm.value;
      if (!value) value = "";
      value = value.replace(" ", "-").toLowerCase();

      for (let element in elements) {
        const workspace = elements[element];
        const id = workspace.id;
        is([id, "string"], (id: string) => {
          if (!id.includes(value)) {
            workspace.classList.add("hidden");
          } else {
            workspace.classList.remove("hidden");
          }
        });
      }
    });
  };

  useEffect(() => {
    is([workspaces, null], () => {
      getAllWorkspaces().then((data: any) => {
        if (data) {
          setWorkspaces(data);
          memWorkspaces.value = data;
        }
      });
    });
  }, []);

  if (!workspaces) {
    return null;
  }

  return (
    <Dialog.Content
      style={{
        maxWidth: 550,
        backgroundColor: "rgba(7, 7, 7, .9)",
        backdropFilter: "blur(5px)",
        padding: "0px",
        borderRadius: "10px",
      }}
    >
      <div className="border-b-1 border-[var(--gray-a4)] p-3 flex items-center gap-3">
        <Icon id="search" />
        <input
          id="searchWorkspacesInput"
          onInput={searchWorkspaces}
          className="w-full bg-transparent text-xs outline-none"
          placeholder="Search your workspaces"
        />
      </div>

      <div className="flex flex-col p-3 pb-1 gap-3">
        <Text style={{ filter: "opacity(.75)" }} size="1" color="gray">
          Your workspaces
        </Text>
        {workspaces.map((item) => (
          <div
            onClick={() => {
              router.push(`/${item.id}`);
            }}
            key={item.id}
            id={item.name.replace(" ", "-").toLowerCase()}
            className="commandButton workspaceElm"
          >
            <div className="w-6 h-6 flex items-center justify-center bg-[#31313131] rounded-md border-1 border-[#35353535] p-0">
              <Icon id="box" />
            </div>
            {item.name}
            {workspace.id === item.id ? (
              <Badge color="gray">current</Badge>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-col p-3 gap-3 mt-2">
        <Text style={{ filter: "opacity(.75)" }} size="1" color="gray">
          Actions
        </Text>
        {actions.map((action) => (
          <div
            onClick={() => {
              router.push(action.link);
            }}
            key={action.name}
            className="commandButton"
          >
            <div className="min-w-max flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center bg-[#31313131] rounded-md border-1 border-[#35353535]">
                <Icon id={action.icon} />
              </div>
              {action.name}
            </div>
            <div className="w-full flex items-center justify-end opacity-80">
              <Badge color="gray" variant="surface">
                {action.shortcut}
              </Badge>
            </div>
          </div>
        ))}
        <div className="w-full border-t-1 border-[var(--gray-a4)]"></div>
        <Dialog.Close>
          <div className="commandButton">
            <div className="min-w-max flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center bg-[#31313131] rounded-md border-1 border-[#34343434]">
                <Icon id="x" size="small" />
              </div>
              Close
            </div>
            <div className="w-full flex items-center justify-end opacity-80">
              <Badge color="gray" variant="surface">
                esc
              </Badge>
            </div>
          </div>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  );
}
