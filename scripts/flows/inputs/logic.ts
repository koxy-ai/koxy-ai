import InputParams from '@/types/inputParams';
import { useCallback } from 'react';
import FlowStore from '../store';

interface Params {
    options: InputParams;
    store: FlowStore;
    block: InputParams["block"];
    param: InputParams["param"];
}

function useInputHandlers({ options, store, block, param }: Params) {

  const changeOptions = useCallback((changes: any) => {
    store.events.push("openInputsDialog", {
      ...options,
      ...changes
    });
  }, [options, store]);

  const updateNodeInputs = useCallback((updates: any) => {
    options.updateNode(block.id, {
      inputs: {
        ...block.data.inputs,
        ...updates
      }
    });
  }, [block.id, block.data.inputs, options]);

  const continueAsType = useCallback((newType: string) => {
    const updates = {
      [param.name]: {
        ...block.data.inputs[param.name],
        value: "",
        type: newType
      }
    };
    updateNodeInputs(updates);

    const changes = {
      param: {
        ...options.param,
        type: newType
      },
      inputs: {
        ...options.inputs,
        [param.name]: {
          value: "",
          key: param.name,
          type: newType
        }
      }
    };
    changeOptions(changes);
  }, [param.name, options, updateNodeInputs, changeOptions]);

  const changeValue = useCallback((value: unknown) => {
    const updates = {
      [param.name]: {
        ...block.data.inputs[param.name],
        value
      }
    };
    updateNodeInputs(updates);

    store.events.push("openInputsDialog", {
      ...options,
      inputs: {
        ...options.inputs,
        [param.name]: {
          value,
          key: param.name,
          type: param.type
        }
      }
    });
  }, [param, options, store, updateNodeInputs]);

  return { changeOptions, continueAsType, changeValue };
}

export default useInputHandlers;