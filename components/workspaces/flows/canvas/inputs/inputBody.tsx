"use client"

import { useState, useEffect } from "react";
import { inputTypes } from "./inputs";
import { Text, Badge } from "@radix-ui/themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import ChangeTypeDrop from "./changeTypeDrop";
import EditType from "./editType";
import FlowStore from "@/scripts/flows/store";
import InputParams from "@/types/inputParams";
import useInputHandlers from "@/scripts/flows/inputs/logic";
import Unknown from "./unknown";

interface Params {
    options: InputParams;
    open: boolean;
    setOpen: (open: boolean) => void;
    setOptions: (options: InputParams | null) => void;
    store: FlowStore;
}

interface BasicInputParams {
    paramName: string
    type: string
    inputs: Record<string, Record<string, unknown>>
    changeValue: (value: unknown) => void
}

// This file defines the InputBody component which is responsible for rendering the body of an input
// within the flow editor's canvas. The InputBody component is designed to manage and display the
// state of various input parameters, allowing users to interact with and configure the inputs for
// different blocks within a flow.
//
// The component handles the dynamic nature of input types and values, reflecting the changes in the
// UI immediately. It leverages the `useInputHandlers` hook to update input values and types, ensuring
// consistency and reusability. The use of TypeScript interfaces, such as `Params` and `BasicInputParams`,
// provides a clear contract for the data the component expects, enhancing type safety and developer
// experience. The modular structure of the file with smaller subcomponents like `ChangeTypeDrop` and
// `EditType` promotes maintainability and scalability of the flow editor.
export default function InputBody(params: Params) {

    let { options, store, open, setOpen, setOptions } = params;
    const { block, param, inputs } = options;

    const [type, setType] = useState<string>(param.type);

    const { continueAsType, changeValue } = useInputHandlers({
        options,
        store,
        block,
        param
    });

    if (param.type === "unknown") {
        return (
            <Unknown
                type={type}
                setType={setType}
                param={param}
                continueAsType={continueAsType}
            />
        )
    }

    return (
        <>
            <div className="flex items-center gap-3">
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-2">
                        <Text weight="medium" size="2">{param.name}</Text>
                        <Badge color={inputTypes[param.type] as any}>
                            {param.type}
                        </Badge>
                    </div>

                    <Text size="2" color="gray">
                        {param.ui?.placeholder || `What is ${param.name} input value?`}
                    </Text>
                </div>
                {param.typeChange && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                size="xs"
                                variant="secondary"
                                className="opacity-80 bg-accent/80"
                            >
                                <Icon id="edit" />
                                Change type
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <EditType value={inputs[param.name]?.value} setType={continueAsType} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <BasicInput
                changeValue={changeValue}
                paramName={param.name}
                type={type}
                inputs={inputs}
            />

            {/* <MagicInputs options={options} /> */}

            <div className="flex items-end justify-end gap-3">
                <Button
                    size="sm"
                    variant="default"
                    onClick={() => setOpen(false)}
                >
                    Done
                </Button>
            </div>
        </>
    )

}

function BasicInput({ paramName, type, inputs, changeValue }: BasicInputParams) {
    const [inputValue, setInputValue] = useState(inputs[paramName]?.value as string || "");

    useEffect(() => {
        setInputValue(inputs[paramName]?.value as string || "");
    }, [inputs, paramName]);

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setInputValue(value);
        changeValue(value);
    };

    return (
        <input
            type={type}
            placeholder="Input value..."
            value={inputValue}
            onInput={handleInput}
            className="paramInput m-0"
        />
    );
}
