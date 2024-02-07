"use client"

import { Dialog } from "@/components/ui/dialog";
import FlowStore from "@/scripts/flows/store";
import { Text, DialogContent } from "@radix-ui/themes";
import { inputTypes } from "./inputs";
import { useState } from "react";
import Icon from "@/components/Icon";
import InputBody from "./inputBody";
import InputParams from "@/types/inputParams";

interface InfoRowParams {
    name: string;
    value: string;
    icon: string;
    color?: string;
}

export default function InputsDialog({ store }: { store: FlowStore }) {

    const [_forceUpdate, setForceUpdate] = useState(false);
    const [options, setOptions] = useState<InputParams | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [type, setType] = useState<string>("");

    const openInputsDialog = (gotOptions: InputParams) => {
        setOptions(gotOptions);
        setType(gotOptions.param.type);
        setOpen(true);
        setForceUpdate(prev => !prev);
    }

    store.events.addListener(
        "openInputsDialog",
        "inputsDialog",
        openInputsDialog
    )

    if (!options) {
        return null;
    }

    const { param, source, inputs, block } = options;

    return (
        <>
            <Dialog defaultOpen={true} open={open} onOpenChange={setOpen}>
                <DialogContent
                    style={{
                        maxWidth: 750,
                        height: 400,
                        minHeight: 400,
                        maxHeight: 400,
                        backgroundColor: "rgba(7, 7, 7, .9)",
                        backdropFilter: "blur(5px)",
                        borderRadius: ".5rem",
                        padding: "1rem"
                    }}
                    className="relative overflow-auto"
                >

                    <div className="flex w-full min-h-[100%]">

                        <div className="w-[25%] p-2 pl-3 pr-3 flex flex-col gap-3">
                            <InfoRow
                                name="Block"
                                value={block.data.label}
                                icon="package"
                            />
                            <InfoRow
                                name="Source"
                                value={source.name}
                                icon="source-code"
                            />
                            <div className="w-full border-t-1 border-border/50 mt-3 mb-3"></div>
                            <InfoRow
                                name="Key"
                                value={param.name}
                                icon="square-key"
                            />
                            <InfoRow
                                name="Type"
                                value={type}
                                icon="brand-typescript"
                                color={inputTypes[type] as any}
                            />
                        </div>

                        <div className="min-h-[100%] border-l-1"></div>

                        <div className="w-[75%] min-h-[100%] p-2 pl-4 pr-1 flex flex-col gap-5">

                            <InputBody
                                options={options}
                                open={open}
                                setOpen={setOpen}
                                setOptions={setOptions}
                                store={store}
                            />

                        </div>

                    </div>

                </DialogContent>
            </Dialog >
        </>
    )

}

function InfoRow({ name, value, icon, color }: InfoRowParams) {

    return (
        <div className="flex items-center gap-1">
            <Text size="1" color="gray">{name}: </Text>
            <Text size="1" color={(color) && color as any}>{value}</Text>
        </div>
    )

}

function MagicInputs(props: { options: InputParams }) {

    const { options } = props;
    const { updateNode, block, source } = options;

    return (
        <div className="w-full h-full border-1 rounded-md border-border/70 bg-border/10">
            <div className="flex items-center gap-1 p-2 border-b-1 border-border/70">
                <Icon id="wand" options={{ color: "gray" }} />
                <Text size="1" color="gray">Magic inputs</Text>
            </div>
            <div className="w-full p-2 max-h-[12rem] overflow-y-auto">
                <div className="flex items-center gap-2">
                    <Text size="1">Available magic inputs</Text>
                </div>
            </div>
        </div>
    )

}