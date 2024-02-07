import Block from "@/types/block";
import Map from "@/types/map";
import Pointer from "@/types/pointer";
import { Edge, Node } from "reactflow";

export interface MapBlock {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    [key: string]: unknown;
  };
  type: "pointer" | "block" | "condition" | "end";
}

export interface MapEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  type?: string;
}

/**
 * Transforms method blocks into map blocks and map edges suitable for rendering in a flow diagram.
 * It iterates over each block in the provided blocks map, creating a list of `MapBlock` and `MapEdge`
 * instances that represent the nodes and connections of the flow diagram, respectively.
 *
 * A 'pointer' type block is transformed into an animated edge, while a 'block' type can generate
 * 'failed' and/or success edges based on its 'next' property.
 *
 */
export function methodBlocksToMapBlocks(blocks: Map) {
  const mapBlocks: Node[] = [];
  const mapEdges: Edge[] = [];

  const keys = Object.keys(blocks);

  for (const key in keys) {
    if (!keys.hasOwnProperty(key)) continue;
    const block = blocks[keys[key]];

    mapBlocks.push({
      id: block.id,
      position: {
        x: block.position.x,
        y: block.position.y,
      },
      data: {
        label: keys[key],
        ...block,
      },
      type: block.type,
    });

    if (block.type === "pointer") {
      mapEdges.push({
        id: `${key}-to-${block.target}`,
        source: block.id,
        target: blocks[block.target]?.id || "null",
        animated: false,
        type: "pointer",
      });
    }

    if (block.type === "block") {
      if (block.next.failed) {
        mapEdges.push({
          id: `${key}-failed-to-${block.next.failed}`,
          source: `failed-${block.id}`,
          target: block.next.failed,
          animated: false,
          type: "failed",
        });
      }
      if (block.next.success) {
        mapEdges.push({
          id: `${key}-success-to-${block.next.success}`,
          source: block.id,
          target: block.next.success,
          animated: false,
        });
      }
    }
  }

  return [mapBlocks, mapEdges];
}

/**
 * The `mapBlocksToMethodBlocks` function converts nodes and edges from a flow diagram back into a map
 * representation of a process or method. It takes arrays of `Node` and `Edge` objects as input, which
 * represent the visual components of the flow diagram. The function then iterates over these arrays
 * to construct a `Map` object that represents the logical structure of the method, including details
 * such as block ids, names, types, and positions, as well as the connections between blocks.
 * This map can be used to reconstruct the method or process programmatically or to update the underlying
 * data model that the flow diagram represents.
 */
export function mapBlocksToMethodBlocks(nodes: Node[], edges: Edge[]) {
  const blocks: Map = {};

  for (const node of nodes) {
    if (node.type === "pointer") {
      blocks[node.data.label] = {
        id: node.id,
        name: node.data.label,
        type: "pointer",
        target: node.data.target,
        position: {
          x: node.position.x,
          y: node.position.y,
        },
      };

      const edge = edges.find((edge) => edge.source === node.id);
      if (edge) {
        const { target } = edge;
        const sourceNode = node;
        const targetNode = nodes.find((node) => node.id === target);

        if (!sourceNode || !targetNode) continue;
        (blocks[sourceNode.data.label] as Pointer).target =
          targetNode?.data.label;
      }
    }

    if (node.type === "block") {
      blocks[node.data.label] = {
        id: node.id,
        name: node.data.label,
        source: node.data.source,
        inputs: node.data.inputs,
        type: "block",
        next: node.data.next,
        position: {
          x: node.position.x,
          y: node.position.y,
        },
      };
    }
  }

  // Edges must be processed from the nodes to be able to process them based on the source type
  // in a faster way instead of looping two times, we loop only once with the nodes.

  // for (const edge of edges) {

  //     const { source, target } = edge;

  //     if (edge.type === "pointer") {

  //         const { source, target } = edge;
  //         const sourceNode = nodes.find(node => node.id === source);
  //         const targetNode = nodes.find(node => node.id === target);

  //         if (!sourceNode || !targetNode) continue;
  //         (blocks[sourceNode.data.label] as Pointer).target = targetNode?.data.label;

  //     }

  //     if (edge.type === "success" || edge.type === "failed") {
  //         const { source, target } = edge;
  //         const sourceNode = nodes.find(node => node.id === source);
  //         const targetNode = nodes.find(node => node.id === target);

  //         if (!sourceNode || !targetNode) continue;
  //         (blocks[sourceNode.data.label] as Block).next[edge.type] = targetNode.data.label;
  //     }

  // }

  return blocks;
}
