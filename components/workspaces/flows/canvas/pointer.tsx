"use client";

import {
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  useReactFlow,
  getSmoothStepPath,
  NodeProps,
  MarkerType,
} from "reactflow";
import { Text } from "@radix-ui/themes";
import Icon from "@/components/Icon";

export default function Pointer(block: NodeProps) {
  const { data, selected } = block;

  return (
    <div className="relative group">
      <Handle type="source" position={Position.Right} itemType="pointer" />
      <div className="p-2 pr-4 pl-1 flex items-center gap-2 opacity-70">
        <Icon
          id="arrow-loop-right"
          options={{ color: block.id === "start" ? "var(--power)" : "gray" }}
        />
        <Text size="2">{data?.label}</Text>
      </div>
      <div
        className={`absolute group-hover:scale-100 transition-transform ${selected ? "scale-100" : "scale-0"}`}
      >
        <Text size="1" color="gray">
          pointer
        </Text>
      </div>
    </div>
  );
}

export function PointerEdge(data: {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}) {
  const { id, sourceX, sourceY, targetX, targetY } = data;

  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={MarkerType.ArrowClosed} />
      <EdgeLabelRenderer>
        <>
          <button
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan bg-accent pl-2 pr-2 border-1 border-red-500/40 text-xs rounded-full p-0.5 opacity-50 hover:opacity-100 transition-opacity"
            onClick={() =>
              setEdges((edges) => edges.filter((e) => e.id !== id))
            }
          >
            <Text color="red" size="1">
              break
            </Text>
          </button>
        </>
      </EdgeLabelRenderer>
    </>
  );
}
