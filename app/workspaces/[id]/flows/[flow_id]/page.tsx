import getWorkspace from "@/app/actions/workspaces/get"
import Workspace from "@/types/workspace"
import Flow from "@/types/flow"
import ClientStore from "./clientStore"

export default async function FlowEditor({ params }: { params: { id: string, flow_id: string } }) {

    const { id, flow_id } = params;
    const workspace: Workspace = await getWorkspace(id);
    const flow: Flow = {
        id: "111",
        name: "this-is-flow",
        status: "111",
        stateUpdated: Date.now(),
        payload: {
            routes: [
                {
                    id: "8ry9894r",
                    updatedAt: Date.now(),
                    path: "main",
                    methods: {
                        get: {

                            start: {
                                id: "start",
                                name: "start",
                                type: "pointer",
                                target: "logger",
                                position: {
                                    x: 80,
                                    y: 80
                                }
                            },

                            logger: {
                                id: String(Math.random() * Date.now()),
                                name: "logger",
                                type: "block",
                                position: {
                                    x: 160,
                                    y: 160
                                },
                                inputs: {},
                                source: "general/logger",
                                next: {}
                            },

                            logger2: {
                                id: String(Math.random() * Date.now()),
                                name: "logger2",
                                type: "block",
                                position: {
                                    x: 160,
                                    y: 160
                                },
                                inputs: {},
                                source: "general/logger",
                                next: {}
                            }

                        },
                    }
                },
                {
                    id: "hfuie7re",
                    updatedAt: Date.now(),
                    path: "models",
                    methods: {
                        get: {

                            start: {
                                id: String(Math.random() * Date.now()),
                                name: "start",
                                type: "pointer",
                                target: "null",
                                position: {
                                    x: 0,
                                    y: 0
                                }
                            },

                        },
                    }
                }
            ],
            env: {
                "KEY": "VALUE"
            }
        }
    }

    return <ClientStore workspace={workspace} flow={flow} />;

}