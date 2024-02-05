"use client"

import React, { useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionLineType
} from 'reactflow';
import FlowStore from '@/scripts/flows/store';

import 'reactflow/dist/style.css';
import '@/styles/editor.css';
import { Tab } from '../top/tabs';
import { Text } from "@radix-ui/themes";
import DashedBorders from '@/components/DashedBorders';
import Icon from '@/components/Icon';
import { methodBlocksToMapBlocks } from '@/scripts/flows/mapFormetter';
import FlowMap from '@/types/map';
import { shallow } from 'zustand/shallow';

import Pointer, { PointerEdge } from "./pointer";
import useStore from '@/scripts/flows/nodesStore';
import ConnectionLine from './connection';

const selector = (state: any) => ({
  changeTab: state.changeTab,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export default function MainCanvas({ store }: { store: FlowStore }) {
  // State to track the current rendering component and selected tab
  const [renderComp, setRenderComp] = useState<"none" | "loading" | "map" | "404">("loading");
  const [tab, setTab] = useState<Tab | undefined>(undefined);

  // Node and Edge types for the React Flow component
  const nodeTypes = useMemo(() => ({ pointer: Pointer }), []);
  const edgeTypes = useMemo(() => ({ default: PointerEdge, pointer: PointerEdge }), []);

  // Store hooks for state and actions related to nodes and edges
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    changeTab
  } = useStore(selector, shallow);

  useStore((state) => state.flowStore = store, shallow);
  const setNodes = useStore((state) => state.setNodes);
  const setEdges = useStore((state) => state.setEdges);

  // Listen to tab changes and update the UI accordingly
  store.events.addListener(
    "changeTab",
    "nodesMap",
    (newTab: "none" | Tab) => {
      if (newTab === "none") {
        setRenderComp("none");
        return;
      }

      setTab(newTab);
      changeTab(newTab);
      const route = (store.routes.getOne(newTab.routeId) || [])[0] || {};
      const isMethodValid = route?.methods?.hasOwnProperty(newTab.method);

      setRenderComp(isMethodValid ? "map" : "404");
      if (!isMethodValid) {
        return;
      }
      const [blocks, edges] = methodBlocksToMapBlocks(route.methods[newTab.method] as FlowMap);
      setNodes(blocks as any);
      setEdges(edges as any);
    },
  );

  // Conditional rendering based on the current state
  if (renderComp === "loading") {
    return <Loading />;
  }
  if (renderComp === "404") {
    return <NotFound />;
  }
  if (renderComp === "none" || !tab) {
    return <Welcome />;
  }

  // Main React Flow component with configured nodes, edges and UI controls
  return (
    <div style={{
      width: 'calc(100vw - 16rem)',
      height: 'calc(100vh - 4.8rem)',
      paddingTop: "3rem",
      overflow: "hidden"
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: "#818181", filter: "opacity(0.4)" }}
        connectionLineComponent={ConnectionLine}
      >
        <Background variant={BackgroundVariant.Dots} color="#81818181" />
        <Controls position="top-right" showFitView={false} />
        <MiniMap
          maskColor="rgba(255, 255, 255, 0.03)"
          className="rounded-md border-1"
          pannable
          zoomable
          ariaLabel={""}
          offsetScale={1.5}
          nodeBorderRadius={0}
          zoomStep={5}
          nodeColor={(node: Node) => {
            if (node.data.type === "pointer") {
              return "var(--power)";
            }
            return "#616161";
          }}
        />
      </ReactFlow>
    </div>
  );
}

const Loading = () => (
  <EmptyPage
    text="Loading..."
    icon="loader-quarter"
    color="#515115"
  />
)

const Welcome = () => (
  <EmptyPage
    text="Select a route method to start editing"
    icon="route"
    color="#515115"
  />
)

const NotFound = () => (
  <EmptyPage
    text="Map not found"
    icon="alert-circle"
    color="#ef4444"
  />
)

function EmptyPage({ text, icon, color }: { text: string, icon: string, color: string }) {

  return (
    <div className="flex flex-col items-center justify-center w-full" style={{ height: "calc(100vh - 4.8rem)" }}>
      <PageIcon icon={icon} color={color} />
      <Text size="1" color="gray">{text}</Text>
    </div>
  )

}

function PageIcon({ icon, color }: { icon: string, color: string }) {
  return (
    <div className="w-full h-36 mt-4 flex items-center justify-center relative">
      <div className="flex w-24 h-24 relative items-center justify-center flex-col">
        <DashedBorders />
        <Icon id={icon} size="30px" />
        <div style={{ boxShadow: `0px 0px 150px 20px ${color}` }}></div>
      </div>
    </div>
  )
}