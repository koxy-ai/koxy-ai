import getWorkspace from "@/app/actions/workspaces/get";
import Workspace from "@/types/workspace";
import Flow from "@/types/flow";
import ClientStore from "./clientStore";
import getBlocksSource from "@/functions/get-blocks-source";
import SourceBlocks from "@/types/sourceBlocks";

export default async function FlowEditor({
  params,
}: {
  params: { id: string; flow_id: string };
}) {
  const { id, flow_id } = params;
  const workspace: Workspace = await getWorkspace(id);

  const blocksSource = (await getBlocksSource()) as string | null;

  if (!blocksSource) {
    return null;
  }

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
                  y: 80,
                },
              },

              logger: {
                id: String(Math.random() * Date.now()),
                name: "logger",
                type: "block",
                position: {
                  x: 160,
                  y: 160,
                },
                inputs: {},
                source: "general/logger",
                next: {},
              },

              "add variable": {
                id: String(Math.random() * Date.now()),
                name: "Add variable",
                type: "block",
                position: {
                  x: 160,
                  y: 160,
                },
                inputs: {},
                source: "general/addVariable",
                next: {},
              },

              "add variable 2": {
                id: String(Math.random() * Date.now() * 2),
                name: "Add variable",
                type: "block",
                position: {
                  x: 160,
                  y: 160,
                },
                inputs: {},
                source: "general/addVariable",
                next: {},
              },

              "add variable 3": {
                id: String(Math.random() * Date.now() * 3),
                name: "Add variable",
                type: "block",
                position: {
                  x: 160,
                  y: 160,
                },
                inputs: {},
                source: "general/addVariable",
                next: {},
              },

              "add variable 4": {
                id: String(Math.random() * Date.now() * 4),
                name: "Add variable",
                type: "block",
                position: {
                  x: 160,
                  y: 160,
                },
                inputs: {},
                source: "general/addVariable",
                next: {},
              },
            },
          },
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
                  y: 0,
                },
              },
            },
          },
        },
      ],
      env: {
        KEY: "VALUE",
      },
    },
  };

  return (
    <ClientStore
      workspace={workspace}
      flow={flow}
      sourceBlocks={blocksSource}
    />
  );
}
