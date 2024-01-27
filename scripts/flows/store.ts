/*
    It's used to keep the changed flow synced across all components without the need to save it
    to the database or redeploy it.
    useful for type testing, prevent unneeded deployments tries,
    and real-time data update across components (maybe soon between team members too).

    JUST NEVER CHANGE THIS ONE
*/

import pushError from "@/components/workspaces/flows/pushError";
import pushSuccess from "@/components/workspaces/flows/pushSuccess";
import { Events } from "@/scripts/flows/events";
import Flow, { Route } from "@/types/flow";
import Methods from "@/types/methods";
import Versions from "./versions";

type StoreConstructorProps = {
    flow: Flow,
    initNew: boolean
};

class FlowStore {

    flow: Flow;
    events: Events;
    versions: Versions;

    constructor(options: StoreConstructorProps) {
        const { flow, initNew } = options;

        if (typeof window === "undefined") {
            this.flow = flow;
            this.events = new Events(this.flow.id);
            this.versions = new Versions();
            return;
        }

        if (initNew) {
            origin.set(flow, flow.stateUpdated);
        }

        const sessionFlow = session.get(flow.id);
        const originDate = flow.stateUpdated;
        const sessionDate = sessionFlow.stateUpdated;

        // Choose which version of the flow is newer.
        if (originDate > sessionDate) {
            this.flow = flow;
        } else {
            this.flow = sessionFlow;
        }

        this.versions = new Versions();
        this.versions.makeVerion(this.flow);
        this.events = new Events(this.flow.id);
        this.pushFlow(this.flow);
    }

    refresh() {
        const originFlow = origin.get(this.flow.id);
        const sessionFlow = session.get(this.flow.id);
        if (!originFlow || !sessionFlow) {
            pushError("Error: Can't read flow data");
            return;
        }
        if (originFlow.stateUpdated > sessionFlow.stateUpdated) {
            this.flow = originFlow;
            return;
        }
        this.flow = sessionFlow;
    }

    // --- Changes (make, undo, push, and is)

    // Push a flow change and update the session.
    // Called everytime a change is made to the flow.
    pushFlow(flow: Flow) {
        this.flow = flow;
        session.set(flow);
        this.events.push("flowChanged", flow);
        this.events.push("routesChanged", flow.payload.routes);
    }

    // get if the flow has been changed or updated
    isChanged(): boolean {
        const latest = JSON.stringify(this.flow);
        const original = JSON.stringify(origin.get(this.flow.id));
        return (original === latest) ? true : false;
    }

    // Make changes to the flow.
    makeChange(action: Function) {
        this.versions.makeVerion(this.flow);
        action();
        this.pushFlow(this.flow);
    }

    undoChange() {
        this.versions.pop();
        const prev = this.versions.undoLatest();
        this.pushFlow(prev);
    }

    // --- Flow Routes basic logic

    routes = {

        get: () => {
            return this.flow?.payload?.routes;
        },

        getOne: (id: string): Route[] | false => {
            const wantedRoutes = this.flow?.payload?.routes
                .filter(route => route.id === id);

            return (!wantedRoutes || wantedRoutes.length < 1) ? false : wantedRoutes;
        },

        filter: (options: { path?: string, method?: string }): Route[] | false => {
            const { path, method } = options;

            const wantedRoutes = this.flow?.payload?.routes
                .filter(route => 
                    route.path === String(path || route.path) && 
                    route.method === String(method || route.method));

            return (!wantedRoutes || wantedRoutes.length < 1) ? false : wantedRoutes;
        },

        areChanged: () => {
            const originalRoutes = origin.get(this.flow.id)?.payload?.routes;
            const latestRoutes = this.flow?.payload.routes;
        },

        editRoute: (options: { id: string, newPath: string, newMethod: Methods }) => {
            const { id, newPath, newMethod } = options;

            const wantedRoute = this.routes.getOne(id);
            const flow = this.flow;
            const { payload } = flow;

            if (!wantedRoute) { return pushError(""); }

            const doesExist = this.routes.filter({
                path: newPath,
                method: newMethod
            })

            if (doesExist) {
                return pushError(`a route ${newMethod}:${newPath} already exist`);
            }

            this.makeChange(() => {
                payload.routes[payload.routes.indexOf(wantedRoute[0])].path = newPath;
                payload.routes[payload.routes.indexOf(wantedRoute[0])].method = newMethod;
                flow.payload = payload;
                pushSuccess("Edited route", this);
            })
        },

        deleteRoute: (route: Route) => {
            const { id } = route;
            const wantedRoute = this.routes.getOne(id);
            const flow = this.flow;
            const { payload } = flow;

            if (!wantedRoute) { return false; }

            this.makeChange(() => {
                delete payload.routes[payload.routes.indexOf(wantedRoute[0])];
                flow.payload = payload;
                pushSuccess("Deleted route", this);
            })
        }

    }

}

const session = {

    set: (flow: Flow, date?: number): { success: boolean, data?: Flow } => {
        try {
            flow.stateUpdated = date || Date.now();
            localStorage.setItem(
                `flow-session-${flow.id}`,
                JSON.stringify(flow)
            );
            return { success: true };
        }
        catch (err: unknown) {
            return { success: false };
        }
    },

    get: (id: string): Flow => {
        const data = localStorage.getItem(`flow-session-${id}`);
        if (data) {
            return JSON.parse(data);
        }

        return origin.get(id) as Flow;
    },

}

const origin = {

    set: (flow: Flow, date?: number): void => {
        try {
            flow.stateUpdated = date || Date.now();
            sessionStorage.setItem(
                `flow-origin-${flow.id}`,
                JSON.stringify(flow)
            );
            return;
        }
        catch (err: unknown) {
            return;
        }
    },

    get: (id: string): Flow | null => {
        const data = sessionStorage.getItem(`flow-origin-${id}`);
        try {
            return JSON.parse(data as string);
        } catch (err: unknown) {
            return null;
        }
    },

    update: (flow: Flow): void => {
        const original = origin.get(flow.id);

        if (!original) {
            return;
        }

        const originDate: number = original?.stateUpdated || 0;
        const newDate = Date.now();

        if (originDate < newDate) {
            return origin.set(flow, newDate);
        }

        return;
    }

};

export default FlowStore;