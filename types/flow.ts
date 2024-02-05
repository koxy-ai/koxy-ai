import FlowMap from "./map";

export type Route = {
    id: string,
    updatedAt: number,
    methods: {
        get?: FlowMap,
        post?: FlowMap,
        put?: FlowMap,
        delete?: FlowMap,
        patch?: FlowMap,
        head?: FlowMap
    },
    path: string,
};

interface Flow {
    id: string,
    name: string,
    status: string,
    payload: {
        routes: Route[],
        env: Record<string, string>
    },
    stateUpdated: number
};

export default Flow;