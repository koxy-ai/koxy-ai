import { createWithEqualityFn } from 'zustand/traditional';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';
import { mapBlocksToMethodBlocks } from './mapFormetter';
import FlowStore from './store';
import { Tab } from '@/components/workspaces/flows/top/tabs';

interface RFState {
    nodes: Node[];
    edges: Edge[];
    flowStore: FlowStore | null;
    storeTab: Tab | undefined;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    pushChangesToFlow: () => void;
    changeTab: (tab: Tab) => void;
    updateNode: (id: string, updates: any) => void;
};

const useStore = createWithEqualityFn<RFState>((set, get) => ({
    nodes: [],
    edges: [],
    flowStore: null,
    storeTab: undefined,

    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
        get().pushChangesToFlow();
    },

    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
        get().pushChangesToFlow();
    },

    onConnect: (connection: Connection) => {
        
        const { source, target } = connection;
        const sourceNode = get().nodes.find(node => node.id === source);
        if (!sourceNode) return;

        const edge = get().edges.find(edge => edge.source === source && edge.target === target);
        const edgeType = edge?.data?.type;

        set({ edges: get().edges
            .filter(edge => edge.source !== source && edge?.type !== edgeType)
        });
        set({ edges: addEdge({...connection, type: edgeType}, get().edges) });

        get().pushChangesToFlow();

    },

    setNodes: (nodes: Node[]) => {
        set({ nodes });
        get().pushChangesToFlow();
    },

    setEdges: (edges: Edge[]) => {
        set({ edges });
        get().pushChangesToFlow();
    },

    pushChangesToFlow: () => {

        const { nodes, edges, flowStore, storeTab } = get();
        if (!flowStore || !storeTab){
            return;
        }

        const wantedRoute = (flowStore.routes.getOne(storeTab.routeId) || [])[0];
        if (!wantedRoute) return;

        const map = mapBlocksToMethodBlocks(nodes, edges);
        wantedRoute.methods[storeTab.method] = map;

    },

    changeTab(tab: Tab) {
        set({ storeTab: tab });
    },

    updateNode(id: string, updates: any) {
        set({ 
            nodes: get().nodes.map(
                node => node.id === id ? {...node, data: { ...node.data, ...updates }} : node
            ) 
        });
        get().pushChangesToFlow();
    }

}));

export default useStore;
