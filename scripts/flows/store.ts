/*
    I don't need to say that this store is use only from client-side components ;).
    It's used to keep the changed flow synced across all components without the need to save it
    to the database or redeploy it.
    useful for type testing, prevent unneeded deployments tries, 
    and real-time data update across components (maybe soon between team members too).
*/

import flowEvents from "@/scripts/flows/events";
import Flow, { Route } from "@/types/flow";
import Methods from "@/types/methods";

type StoreConstructorProps = {
    flow: Flow,
    initNew: boolean
};

interface ChangeRoutePath {
    type: "change-path", 
    route: Route, 
    newPath: string 
}

interface ChangeRouteMethod {
    type: "change-method", 
    route: Route, 
    newMethod: Methods
}

type EditRouteProps = ChangeRoutePath | ChangeRouteMethod;

const listeners: string[] = [];
const versions: Flow[] = [];

class FlowStore {

    flow: Flow;
    store = store;

    constructor(options: StoreConstructorProps) {

        const { flow, initNew } = options;

        if (initNew) {
            origin.set(flow, Date.now());
            this.flow = flow;
        } else {
            this.flow = store.get(flow.id);
        }

        flowEvents.on(this.events.channelId("flow-changed"), (flow: Flow) => {
            versions.push(flow);
            this.flow = flow;
            store.set(flow);
        })

    }

    undoChange() {
        if (versions.length < 1) {
            return;
        }
        versions.pop();
        this.flow = versions[versions.length - 1] || this.flow
        this.events.pushFlow();
    }

    events = {

        push: (channel: string, msg?: unknown) => {
            flowEvents.emit(`${this.flow.id}-${channel}`, msg);
        },
 
        channelId: (channel: string) => ( `${this.flow.id}-${channel}` ),

        addListener: (channel: string, component: string, cb: Function) => {
            
            const isListening = (listeners.indexOf(component) === -1) ? false : true;
            
            if (isListening) {
                return false;
            }
            
            flowEvents.on(this.events.channelId(channel), (msg: unknown) => {
                cb(msg);
            })

        },

        pushFlow: () => {
            store.set(this.flow);
            this.events.push("flow-changed", this.flow);
        }

    }

    // get if the flow has been changed or updated
    isChanged(): boolean {
        const latest = JSON.stringify(this.flow);
        const original = JSON.stringify(origin.get(this.flow.id).data);
        return (original === latest) ? true : false;
    }

    routes = {

        get: () => {
            return this.flow?.payload?.routes;
        },

        getOne: (options: { path?: string, method?: string }): Route[] | false => {

            const { path, method } = options;

            const wantedRoutes = this.flow?.payload?.routes
                .filter(route => route.path === path || route.path)
                .filter(route => route.method === method || route.method)
            ;

            return (!wantedRoutes || wantedRoutes.length < 0) ? false : wantedRoutes;

        },

        areChanged: () => {
            const originalRoutes = origin.get(this.flow.id)?.data?.payload?.routes;
            const latestRoutes = this.flow?.payload.routes;
        },

        editRoute: (options: EditRouteProps) => {

            const { type, route } = options;

            const { path, method } = route;
            const wantedRoute = this.routes.getOne({ path, method });
            const flowP = this.flow.payload;
            
            if (!wantedRoute) {
                return false;
            }

            if (type === "change-path") {
                flowP.routes[flowP.routes.indexOf(wantedRoute[0])].path = options.newPath;
                this.flow.payload = flowP;
                this.events.push("routes-changed", `Changed path to ${options.newPath}`);
            }

            if (type === "change-method") {
                flowP.routes[flowP.routes.indexOf(wantedRoute[0])].path = options.newMethod;
                this.flow.payload = flowP;
                this.events.push("routes-changed", `Changed path to ${options.newMethod}`);
            }

            this.events.pushFlow();

        },

        deleteRoute: (route: Route) => {
            
            const { path, method } = route;
            const wantedRoute = this.routes.getOne({ path, method });
            const flowP = this.flow.payload;

            if (!wantedRoute) {
                return false;
            }

            delete flowP.routes[flowP.routes.indexOf(wantedRoute[0])]
            this.flow.payload;
            this.events.push("routes-changed", `Deleted route`);
            this.events.pushFlow();

        }

    }

}

const store = {

    set: (flow: Flow, date?: number): { success: boolean, data?: Flow } => {
        try {
            flow.stateUpdated =  date || Date.now();
            sessionStorage.setItem(
                `flow-store-${flow.id}`, 
                JSON.stringify(flow)
            );
            return { success: true };
        }
        catch (err: unknown) {
            return { success: false };
        }
    },

    get: (id: string): Flow => {
        
        const data = sessionStorage.getItem(`flow-store-${id}`);
        return JSON.parse(data || "{}");

    },

}

const origin = {

    set: (flow: Flow, date?: number): { success: boolean, data?: Flow } => {
        try {
            flow.stateUpdated =  date || Date.now();
            sessionStorage.setItem(
                `flow-origin-${flow.id}`, 
                JSON.stringify(flow)
            );
            return { success: true };
        }
        catch (err: unknown) {
            return { success: false };
        }
    },

    get: (id: string): { success: boolean, data?: Flow } => {
        const data = sessionStorage.getItem(`flow-origing-${id}`);
        if (data) {
            return {
                success: true,
                data: JSON.parse(data)
            }
        }
        return {
            success: false
        };
    },

    update: (flow: Flow): { success: boolean, data?: Flow } => {
        const original = origin.get(flow.id);

        if (!original.success) {
            return original;
        }

        const originDate: number = original?.data?.stateUpdated || 0;
        const newDate = Date.now();

        if (originDate < newDate) {
            return origin.set(flow, newDate);
        }

        return {
            success: false
        };
    }

};

export default FlowStore;