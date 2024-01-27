import Methods from "./methods";

export type RouteCode = {
    name: string,
    content: string
};

export type Route = {
    id: string,
    updatedAt: number,
    method: Methods,
    path: string,
    code: RouteCode[]
};

interface Flow {
    id: string,
    name: string,
    status: string,
    payload: {
        routes: Route[],
        nodes: any[]
    },
    stateUpdated: number
};

export default Flow;