/*
    It's used to keep the changed flow synced across all components without the need to save it
    to the database or redeploy it.
    useful for type testing, prevent unneeded deployments tries,
    and real-time data update across components (maybe soon between team members too).

    Components in the editor can communicate together in real time using the store events.
    It's an easy way to keep the flow in sync across all components without having to save it to the database.

    Most different components can listen to the store events and update their state.
    and we keep track of the state update date to keep it in sync between team members and components in real-time.

    JUST NEVER CHANGE THIS ONE
*/

import pushError from "@/components/workspaces/flows/pushError";
import pushSuccess from "@/components/workspaces/flows/pushSuccess";
import { Events } from "@/scripts/flows/events";
import Flow, { Route } from "@/types/flow";
import Versions from "./versions";

type StoreConstructorProps = {
    flow: Flow,
    initNew: boolean
};

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head';

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
        const updateAt = Date.now();
        flow.stateUpdated = updateAt;
        this.flow = flow;
        session.set(flow, updateAt);
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

        filter: (options: { path?: string, method?: HttpMethod }): Route[] | false => {
            const { path, method } = options;

            let wantedRoutes = this.flow?.payload?.routes
                .filter(route => route.path === String(path || route.path))

            if (method) {
                wantedRoutes = wantedRoutes
                    .filter(route => route.methods[method]);
            }

            return (!wantedRoutes || wantedRoutes.length < 1) ? false : wantedRoutes;
        },

        areChanged: () => {
            const originalRoutes = origin.get(this.flow.id)?.payload?.routes;
            const latestRoutes = this.flow?.payload.routes;
            return (JSON.stringify(originalRoutes) === JSON.stringify(latestRoutes)) ? false : true;
        },

        editRoute: (options: { id: string, newPath: string }) => {
            const { id, newPath } = options;

            const wantedRoute = this.routes.getOne(id);
            const flow = this.flow;
            const { payload } = flow;

            if (!wantedRoute) { return pushError(""); }

            const doesExist = this.routes.filter({
                path: newPath,
            })

            if (doesExist) {
                return pushError(`a route ${newPath} already exist`);
            }

            this.makeChange(() => {
                payload.routes[payload.routes.indexOf(wantedRoute[0])].path = newPath;
                payload.routes[payload.routes.indexOf(wantedRoute[0])].updatedAt = Date.now();
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
        },

        addMethod: (routeId: string, method: HttpMethod) => {
            const { payload } = this.flow;
            const wantedRoute = this.routes.getOne(routeId);
            if (!wantedRoute) {
                pushError("Can't find route");
                return;
            }

            const exist = this.routes.filter({
                path: wantedRoute[0].path,
                method
            })

            if (exist) {
                return pushError(`${method} method already exist on ${wantedRoute[0].path}`);
            }

            this.makeChange(() => {
                wantedRoute[0].methods[method] = {
                    start: {
                        id: String(Math.random() * Date.now()),
                        name: "start",
                        type: "pointer",
                        target: "null",
                        position: {
                            x: 0,
                            y: 0
                        }
                    }
                };
                payload.routes[payload.routes.indexOf(wantedRoute[0])] = wantedRoute[0];
                payload.routes[payload.routes.indexOf(wantedRoute[0])].updatedAt = Date.now();
                this.flow.payload = payload;
                pushSuccess("Added method", this);
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

export { session };
export default FlowStore;