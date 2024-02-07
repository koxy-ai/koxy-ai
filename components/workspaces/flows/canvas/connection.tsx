import {
  ConnectionLineComponentProps,
  Position,
  getSmoothStepPath,
} from "reactflow";

export default function ConnectionLine({
  connectionStatus,
  connectionLineStyle,
  fromX,
  fromY,
  toX,
  toY,
}: ConnectionLineComponentProps) {
  const dotColor = connectionStatus === "valid" ? "var(--power)" : "#61616161";

  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  return (
    <g className="cursor-default">
      <path
        fill="none"
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
        style={connectionLineStyle}
      />
      <circle cx={toX} cy={toY} fill={dotColor} r={4.5} strokeWidth={1.5} />
    </g>
  );
}
