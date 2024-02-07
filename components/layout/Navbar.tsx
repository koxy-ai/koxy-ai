"use client";

import Image from "next/image";
import { Avatar, IconButton, Tooltip } from "@radix-ui/themes";
import Icon from "@/components/Icon";
import { useEffect } from "react";
import is from "@/scripts/is";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  active: string;
};

type ButtonProps = {
  icon: string;
  id: string;
  tooltip: string;
};

type NavAction = {
  id: string;
  tooltip: string;
  icon: string;
  path: string;
};

type NavLine = {
  id: string;
  tooltip: string;
  icon: string;
  path: string;
};

export function HomeNav() {
  return <div></div>;
}

const navButtons: Array<NavAction | NavLine> = [
  {
    id: "home",
    tooltip: "Home",
    icon: "home",
    path: "/",
  },
  {
    id: "models",
    tooltip: "AI Models",
    icon: "3d-cube-sphere",
    path: "models",
  },
  {
    id: "line",
    path: "",
    icon: "",
    tooltip: "",
  },
  {
    id: "flows",
    tooltip: "Flows",
    icon: "route",
    path: "flows",
  },
  {
    id: "functions",
    tooltip: "Edge Functions",
    icon: "cloud-code",
    path: "functions",
  },
  {
    id: "line",
    path: "",
    icon: "",
    tooltip: "",
  },
  {
    id: "databases",
    tooltip: "Databases",
    icon: "database",
    path: "databases",
  },
  {
    id: "realtime",
    tooltip: "Realtime",
    icon: "click",
    path: "real-time",
  },
  {
    id: "storage",
    tooltip: "Storage",
    icon: "package",
    path: "storage",
  },
  {
    id: "line",
    path: "",
    icon: "",
    tooltip: "",
  },
  {
    id: "corn",
    tooltip: "Corn Jobs",
    icon: "clock-hour-3",
    path: "corn-jobs",
  },
  {
    id: "settings",
    tooltip: "Settings",
    icon: "settings",
    path: "settings",
  },
];

export function InterfaceNav({ id, active }: Props) {
  const router = useRouter();

  useEffect(() => {
    is([active, "string"], (active: string) => {
      const elm = document.getElementById(active);

      is([elm, "object"], (elm: HTMLElement) => {
        elm.style.background = "#41414141";
      });
    });
  }, []);

  return (
    <>
      <div className="w-8 h-24 gradient opacity-10 fixed top-0 left-0 z-10"></div>
      <div className="interfaceNav">
        <div className="w-full h-10 pt-3 flex items-center justify-center">
          <div
            className="navLogo"
            onClick={() => {
              router.push(`/${id}`);
            }}
          >
            <Image
              width={27}
              height={27}
              src="/koxy-logo.png"
              alt="Koxy AI Logo"
            />
          </div>
        </div>

        <div className="w-[60%] border-t-1 border-[var(--gray-a4)]"></div>

        <div className="flex flex-col gap-5">
          {navButtons.map((item) =>
            item.id === "line" ? (
              <div key={navButtons.indexOf(item)} className="line"></div>
            ) : (
              <div
                key={item.id}
                onClick={() => {
                  router.push(`/${id}/${item.path}`);
                }}
              >
                <Button id={item.id} tooltip={item.tooltip} icon={item.icon} />
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
}

const Button = ({ icon, id, tooltip }: ButtonProps) => {
  return (
    <div className="mx-auto mt-1.5">
      <Tooltip content={tooltip}>
        <IconButton id={id} variant="ghost" highContrast color="gray">
          <Icon id={icon} size="large" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export function WorkspaceNav() {
  return <div></div>;
}
