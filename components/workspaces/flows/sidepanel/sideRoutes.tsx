"use client";

// This file contains the SideRoutes component which is responsible for
// rendering the list of routes in the side panel of a flow.
// It includes the functionality for searching, adding, editing, and
// deleting routes, as well as displaying route options and handling
// route selection.
// State for routes (routesMethodsState) is used to keep track of which routes are open or closed.
// This is important for several reasons:
// 1. User Experience: It allows us to provide a better user experience by remembering the state
//    of each route (whether it is expanded or collapsed) as the user interacts with the application.
// 2. Component State: Having this state at the side panel level allows us to manage the state
//    locally and rerender only the components that need updating when a route's state changes,
//    rather than rerendering the entire application.
// 3. Synchronization: It ensures that the state of the routes is consistent and can be
//    synchronized with other components that might depend on this state, such as the top tabs.

// The top tabs are rendered from the side routes panel to keep the methods state up to date with the top tabs.
// This is crucial because:
// 1. Consistency: It ensures that the state of the routes and methods is consistent across
//    different parts of the UI, so when changes are made in one place (like closing a tab),
//    it reflects everywhere that state is used.
// 2. Centralized State Management: It centralizes the state management for routes and methods
//    in one place, which simplifies the logic and reduces the potential for bugs.
// 3. Seamless Interaction: It provides a seamless interaction between the side routes panel
//    and the top tabs, making it easier for users to understand the relationship between
//    different parts of the UI and how they interact with each other.

import Icon from "@/components/Icon";
import { Text, Badge } from "@radix-ui/themes";
import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import Flow from "@/types/flow";
import FlowStore from "@/scripts/flows/store";
import { OptionsRoot } from "./routeOptions";
import { Route } from "@/types/flow";
import { methodsColors } from "@/types/methods";
import EditRouteDialog from "@/components/workspaces/flows/sidepanel/editRoute";
import DeleteRouteDialog from "./deleteRoute";
import SearchRoutes from "./searchRoutes";
import AddMethod from "./addMethod";
import Tabs, { type Tab } from "../top/tabs";

type RouteFolderProps = {
  children: ReactNode;
  route: Route;
  store: FlowStore;
  onClick: MouseEventHandler;
};

interface SubItemParams {
  route: Route;
  store: FlowStore;
  method: string;
  icon: string;
  color?: string;
}

const routesState: any = {};
const routesMethodsState: Record<string, boolean> = {};

export default function SideRoutes({
  flow,
  store,
}: {
  flow: Flow;
  store: FlowStore;
}) {
  const [routes, setRoutes] = useState(flow?.payload?.routes);
  const [_forceUpdate, setForceUpdate] = useState(false);

  const updateRoutes = (newRoutes: Route[]) => {
    flow.payload.routes = newRoutes;
    setRoutes(newRoutes);
    setForceUpdate((prev) => !prev);
  };

  store.events.addListener("routesChanged", "sideRoutes", updateRoutes);

  if (!routesState[flow.id]) {
    routesState[flow.id] = {};
  }

  const updateOpenTab = (tab: Tab) => {
    Object.keys(routesMethodsState).forEach((key) => {
      if (key !== `${tab.routeId}-${tab.method}`) {
        routesMethodsState[key] = false;
      }
    });
    routesMethodsState[`${tab.routeId}-${tab.method}`] = true;
    setForceUpdate((prev) => !prev);
  };

  const closeAllTabs = () => {
    Object.keys(routesMethodsState).forEach((key) => {
      routesMethodsState[key] = false;
    });
    setForceUpdate((prev) => !prev);
  };

  return (
    <>
      <div className="flex items-center border-border/40 p-5 pt-3 pb-3 gap-2 mt-2 mb-1">
        <div className="flex items-center justify-center cursor-pointer pl-0.5 opacity-80 hover:opacity-100">
          <Icon id="plus" size="small" />
        </div>
        <div className="flex items-center gap-2 ml-1">
          <Icon id="search" options={{ color: "gray" }} size="small" />
          <SearchRoutes />
        </div>
      </div>

      <AddMethod store={store} />
      <EditRouteDialog store={store} />
      <DeleteRouteDialog store={store} />

      {routes.map((route) => (
        <div
          id={`${route.path.toLocaleLowerCase().replace(" ", "-")}-folder`}
          className="routeFolder"
          key={`${route.path}-${route.id}-${Date.now()}`}
        >
          <Route flowId={flow.id} route={route} store={store} />
        </div>
      ))}

      <div className="topPath min-h-[2.7rem] p-0 items-start gap-0">
        <Tabs store={store} update={updateOpenTab} closeAll={closeAllTabs} />
      </div>
    </>
  );
}

function Route({
  flowId,
  route,
  store,
}: {
  flowId: string;
  route: Route;
  store: FlowStore;
}) {
  const { path } = route;
  const [open, setOpen] = useState<boolean>(
    (routesState[flowId] as any)[route.id] || false,
  );

  const toggleOpen = () => {
    const newState = open ? false : true;
    routesState[flowId][route.id] = newState;
    setOpen(newState);
  };

  if (!open) {
    return (
      <ClosedRoute route={route} store={store} onClick={() => toggleOpen()}>
        <>
          <div className="flex items-center gap-2 w-full">
            <Icon id="chevron-right" options={{ color: "gray" }} />
            <Icon id="route-square" options={{ color: "gray" }} />
            <Text color="gray" size="2">
              {path}
            </Text>
          </div>
        </>
      </ClosedRoute>
    );
  }

  return (
    <>
      <OpenRoute route={route} store={store} onClick={() => toggleOpen()}>
        <div className="flex items-center gap-2 w-full">
          <Icon id="chevron-down" options={{ color: "gray" }} />
          <Icon id="route-square" options={{ color: "gray" }} />
          <Text size="2">{path}</Text>
        </div>
      </OpenRoute>
      <SubRoute>
        {Object.keys(route.methods).map((method) => (
          <SubItem
            key={`${route.id}-${method}-${Date.now()}`}
            route={route}
            store={store}
            method={method}
            icon="point-filled"
            color={methodsColors[method]}
          />
        ))}
      </SubRoute>
    </>
  );
}

function ClosedRoute({ route, store, children, onClick }: RouteFolderProps) {
  return (
    <>
      <OptionsRoot route={route} store={store}>
        <div onClick={onClick} className="closedRoute">
          {children}
        </div>
      </OptionsRoot>
    </>
  );
}

function OpenRoute({ route, store, children, onClick }: RouteFolderProps) {
  return (
    <>
      <OptionsRoot route={route} store={store}>
        <div
          onClick={onClick}
          className="openRoute bg-transparent hover:bg-[#26262626]"
        >
          {children}
        </div>
      </OptionsRoot>
    </>
  );
}

function SubRoute({ children }: { children: ReactNode }) {
  return (
    <div className="pl-7 pr-0">
      <div className="border-l-1 border-border/30 flex flex-col">
        {children}
      </div>
    </div>
  );
}

function SubItem({ route, store, method, icon, color }: SubItemParams) {
  color = color || "gray";

  const openTab = () => {
    Object.keys(routesMethodsState).forEach((key) => {
      if (key !== `${route.id}-${method}`) {
        routesMethodsState[key] = false;
      }
    });
    routesMethodsState[`${route.id}-${method}`] = true;
    store.events.push("addTab", {
      routeId: route.id,
      method,
      path: route.path,
    });
  };

  return (
    <button
      onClick={() => openTab()}
      className={`flex items-center w-full gap-2 p-1.5 pr-5 cursor-pointer hover:bg-[#26262626] ${routesMethodsState[`${route.id}-${method}`] ? "border-l-1 border-l-border bg-[#31313131]" : ""}`}
    >
      <div className="flex items-center gap-2 w-full pl-2">
        <Text color={color as any} className="flex items-center justify-center">
          <Icon id={icon} />
        </Text>
        <Text color="gray" size="2">
          {method}
        </Text>
      </div>
    </button>
  );
}
