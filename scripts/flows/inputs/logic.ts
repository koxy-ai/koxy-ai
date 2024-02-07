import InputParams from "@/types/inputParams";
import { useCallback } from "react";
import FlowStore from "../store";

interface Params {
  options: InputParams;
  store: FlowStore;
  block: InputParams["block"];
  param: InputParams["param"];
}

/**
 * This file defines the `useInputHandlers` hook which is used to manage input handling within the flow editor.
 * The hook provides functionality to handle changes to input parameters of blocks within a flow.
 *
 * It includes:
 * - `changeOptions`: A function to update the options state with new changes.
 * - `updateNodeInputs`: A function to update the inputs of a specific node/block in the flow.
 * - `continueAsType`: A function to change the type of an input and reset its value.
 *
 * The hook uses the `store` to listen and push events related to opening the inputs dialog
 * and to make updates to the block nodes as needed. It operates on the `options`, `store`,
 * `block`, and `param` objects provided by the `Params` interface.
 *
 * I'm sorry for making such a messy hook, but it works :)
 */
function useInputHandlers({ options, store, block, param }: Params) {
  store.events.addListener(
    "openInputsDialog",
    "useInputHandlers",
    (gotOptions: InputParams) => {
      options = gotOptions;
      block = gotOptions.block;
      param = gotOptions.param;
    },
  );

  const changeOptions = useCallback(
    (changes: any) => {
      store.events.push("openInputsDialog", {
        ...options,
        ...changes,
      });
      options = { ...options, ...changes };
    },
    [options],
  );

  const updateNodeInputs = useCallback(
    (updates: any) => {
      options.updateNode(block.id, {
        inputs: {
          ...block.data.inputs,
          ...updates,
        },
      });
      if (block.data.inputs[param.name]) {
        block.data.inputs[param.name] = {
          ...block.data.inputs[param.name],
          ...updates,
        };
      } else {
        block.data.inputs[param.name] = {
          value: updates["value"] || "",
          type: param.type,
          key: param.name,
        };
      }
    },
    [block, options],
  );

  const continueAsType = useCallback(
    (newType: string) => {
      const updates = {
        [param.name]: {
          ...block.data.inputs[param.name],
          value: "",
          type: newType,
        },
      };
      updateNodeInputs(updates);

      const changes = {
        param: {
          ...options.param,
          type: newType,
        },
        inputs: {
          ...options.inputs,
          [param.name]: {
            value: "",
            key: param.name,
            type: newType,
          },
        },
      };
      changeOptions(changes);
    },
    [param, options],
  );

  const changeValue = useCallback(
    (value: unknown) => {
      const updates = {
        [param.name]: {
          ...block.data.inputs[param.name],
          value,
          key: param.name,
        },
      };
      updateNodeInputs(updates);

      const changes = {
        inputs: {
          ...options.inputs,
          [param.name]: {
            ...options.inputs[param.name],
            value,
          },
        },
      };

      changeOptions(changes);
    },
    [param, options],
  );

  return { changeOptions, continueAsType, changeValue };
}

export default useInputHandlers;
