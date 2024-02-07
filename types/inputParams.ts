import { BlockNodeData } from "@/components/workspaces/flows/canvas/block";
import FlowStore from "@/scripts/flows/store";
import { NodeProps } from "reactflow";
import ParamUiOptions from "./param-ui";
import SourceBlocks from "./sourceBlocks";

interface InputParams {
    block: NodeProps<BlockNodeData>;
    store: FlowStore;
    updateNode: (id: string, updates: any) => void;
    param: {
        typeChange: boolean;
        name: string;
        type: string;
        ui?: ParamUiOptions;
    };
    inputs: Record<string, Record<string, unknown>>;
    source: SourceBlocks;
}

export default InputParams;