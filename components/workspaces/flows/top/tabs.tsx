"use client";

// Render the top editor tabs and keep them consistent with the methods state,
// and saved locally in local storage.

import Icon from "@/components/Icon";
import { HttpMethod } from "@/scripts/flows/store";
import { MouseEventHandler, useEffect, useState } from "react";
import { Text } from "@radix-ui/themes";
import FlowStore from "@/scripts/flows/store";
import { methodsColors } from "@/types/methods";

interface Params {
  store: FlowStore;
  update: (tab: Tab) => void;
  closeAll: () => void;
}

interface ItemParams {
  tab: Tab;
  isOpen: boolean;
  onClick: MouseEventHandler;
  close: MouseEventHandler;
  isValid: boolean;
}

export interface Tab {
  routeId: string;
  method: HttpMethod;
  path: string;
}

class TabsStore {
  private flowId: string;

  constructor(flowId: string) {
    this.flowId = flowId;
  }

  getTabs = () => {
    if (typeof localStorage === "undefined") {
      return {};
    }
    return JSON.parse(localStorage.getItem(`${this.flowId}-tabs`) || "{}");
  };

  addTab = (tab: Tab) => {
    if (typeof localStorage === "undefined") {
      return;
    }
    const tabs = this.getTabs();
    tabs[`${tab.routeId}-${tab.method}`] = tab;
    localStorage.setItem(`${this.flowId}-tabs`, JSON.stringify(tabs));
  };

  removeTab = (tab: Tab) => {
    if (typeof localStorage === "undefined") {
      return;
    }
    const tabs = this.getTabs();
    delete tabs[`${tab.routeId}-${tab.method}`];
    localStorage.setItem(`${this.flowId}-tabs`, JSON.stringify(tabs));
  };

  resset = () => {
    if (typeof localStorage === "undefined") {
      return;
    }
    localStorage.removeItem(`${this.flowId}-tabs`);
  };
}

export default function Tabs({ store, update, closeAll }: Params) {
  const tabsStore = new TabsStore(store.flow.id);

  const [tabs, setTabs] = useState<Record<string, Tab>>({});
  const [openTab, setOpenTab] = useState<Tab | null>(null);

  useEffect(() => {
    if (Object.keys(tabs).length === 0) {
      const storeTabs = tabsStore.getTabs() as Record<string, Tab>;
      setTabs(storeTabs);
      if (!openTab && Object.keys(storeTabs).length > 0) {
        setOpenTab(Object.values(storeTabs)[0]);
        update(Object.values(storeTabs)[0]);
        store.events.push("changeTab", Object.values(storeTabs)[0]);
      } else {
        store.events.push("changeTab", "none");
      }
    }
  }, []);

  store.events.addListener("addTab", "tabsContainer", (tab: Tab) => {
    addTab(tab);
    setOpenTab(tab);
  });

  const addTab = (tab: Tab) => {
    if (!tabs[`${tab.routeId}-${tab.method}`]) {
      setTabs((prev) => {
        const newTabs = { ...prev };
        newTabs[`${tab.routeId}-${tab.method}`] = tab;
        return newTabs;
      });
    }
    setOpenTab(tab);
    tabsStore.addTab(tab);
    update(tab);
    store.events.push("changeTab", tab);
  };

  const closeTab = (tab: Tab) => {
    const tabKey = `${tab.routeId}-${tab.method}`;
    const tabKeys = Object.keys(tabs);
    const tabIndex = tabKeys.indexOf(tabKey);

    if (openTab === tab) {
      if (tabKeys.length > 1) {
        // Find a new tab to open: previous tab or the first tab if closing the first one
        const newOpenTabIndex = tabIndex === 0 ? 1 : tabIndex - 1;
        const newOpenTab = Object.values(tabs)[newOpenTabIndex];
        store.events.push("changeTab", newOpenTab);
        setOpenTab(newOpenTab);
        update(newOpenTab);
      } else {
        closeAll();
        store.events.push("changeTab", "none");
      }
    }

    setTabs((prevTabs) => {
      const updatedTabs = { ...prevTabs };
      delete updatedTabs[tabKey];
      return updatedTabs;
    });
    tabsStore.removeTab(tab);
  };

  return (
    <>
      {Object.entries(tabs).map(([key, tab]) => {
        const currentRoute = (store.routes.getOne(tab.routeId) || [])[0] || {};
        const path = currentRoute?.path || "";
        const isValid =
          currentRoute?.methods?.hasOwnProperty(tab.method) || false;
        const isOpen =
          openTab?.routeId === tab.routeId && openTab?.method === tab.method;

        return (
          <div key={`${tab.routeId}-${tab.method}-tab-${Date.now()}`}>
            <TabItem
              onClick={() => addTab(tab)}
              close={() => closeTab(tab)}
              tab={{ ...tab, path }}
              isOpen={isOpen}
              isValid={isValid}
            />
          </div>
        );
      })}
    </>
  );
}

function TabItem({ tab, isOpen, onClick, close, isValid }: ItemParams) {
  if (!isOpen) {
    return (
      <div className="editorTab group">
        <button
          onClick={onClick}
          className="flex flex-col w-full items-start pl-3 pr-3 truncate"
        >
          <Text size="1" color={isValid ? "gray" : "red"}>
            {tab.path}
          </Text>
          <Text size="1" color={methodsColors[tab.method] as any}>
            {tab.method}
          </Text>
        </button>
        <button
          onClick={close}
          className="flex items-center justify-center w-5 h-5 hover:bg-accent/60 rounded-sm hidden group-hover:flex"
        >
          <Icon id="x" size="small" options={{ color: "gray" }} />
        </button>
      </div>
    );
  }

  return (
    <div className="editorTab group border-b-1 border-b-power">
      <button
        onClick={onClick}
        className="flex flex-col w-full items-start pl-3 pr-3 truncate"
      >
        <Text size="1" color={isValid ? "gray" : "red"}>
          {tab.path}
        </Text>
        <Text size="1" color={methodsColors[tab.method] as any}>
          {tab.method}
        </Text>
      </button>
      <button
        onClick={close}
        className="flex items-center justify-center w-5 h-5 hover:bg-accent/60 rounded-sm"
      >
        <Icon id="x" size="small" options={{ color: "gray" }} />
      </button>
    </div>
  );
}
