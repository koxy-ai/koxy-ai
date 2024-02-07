import Icon from "@/components/Icon";
import SourceStore from "@/scripts/flows/sourceStore";
import FlowStore, { session } from "@/scripts/flows/store";
import { Text } from "@radix-ui/themes";
import Image from "next/image";
import { Handle, NodeProps, Position } from "reactflow";
import Input from "./inputs/inputs";
import { useState } from "react";

export interface BlockNodeData {
    label: string;
    source: string;
    inputs: Record<string, Record<string, unknown>>;
}

interface BlockParams {
    block: NodeProps<BlockNodeData>;
    store: FlowStore;
    updateNode: (id: string, updates: any) => void;
    sourceStore: SourceStore;
}

export default function Block({ block, store, updateNode, sourceStore }: BlockParams) {

    const { data } = block;
    const source = sourceStore.getOne(data.source);

    if (!source) {
        return null;
    }

    const params = source?.params;

    const update = (updates: any) => {
        updateNode(block.id, updates);
    }

    return (
        <div className="relative min-w-[16rem] max-w-[16rem]">
            <div className="w-full min-w-[16rem] max-w-[16rem] flex items-center p-1 pl-2 pr-2 bg-border/50 rounded-t-[0.5rem] gap-2">
                <Image src="/new-logo.png" alt="Koxy AI Logo" width={22} height={22} />
                <NameInput data={data} update={update} />
            </div>
            <div className="nodrag p-2 pt-4 pb-4 cursor-default flex flex-col gap-3">

                <Handle
                    type="target"
                    position={Position.Left}
                    style={{ top: 55 }}
                />
                <div className="flex items-center gap-1.5">
                    <Icon id="arrow-move-right" options={{ color: "gray" }} />
                    <Text size="1" color="gray">
                        Start Block
                    </Text>
                </div>

                {params?.map((param) => (
                    <Input
                        key={param.name}
                        block={block}
                        store={store}
                        updateNode={updateNode}
                        param={param}
                        inputs={data.inputs}
                        source={source}
                    />
                ))}
            </div>
        </div>
    )

}

function NameInput({ data, update }: { data: BlockNodeData, update: (updates: any) => void }) {

    const [ isInput, setIsInput ] = useState<boolean>(false);

    if (isInput) {
        return (
            <input
                className="nodrag nopan bg-transparent outline-0 text-xs border-b-1 border-dashed w-auto min-w-[0] max-w-[50%]"
                onBlur={() => setIsInput(false)}
                defaultValue={data.label}
                placeholder="Block name..."
                autoFocus
                onInput={(e) => {
                    const value = e.currentTarget.value;
                    if (!value) return;
                    update({
                        label: value,
                        name: value
                    })
                    data.label = value;
                }}
            />
        )
    }

    return (
        <div className="text-xs cursor-pointer" onClick={() => setIsInput(true)}>{data.label}</div>
    )

}
