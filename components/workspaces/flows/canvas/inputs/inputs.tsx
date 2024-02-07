import { Text } from "@radix-ui/themes";
import isJSON from "@/scripts/flows/inputs/isJSON";
import Icon from "@/components/Icon";
import InputParams from "@/types/inputParams";

// Create an object containing all possible input types and colors for them like "{string: green}"
const inputTypes: Record<string, string> = {
    string: "green",
    number: "blue",
    boolean: "tomato",
    object: "purple",
    array: "orange",
    unknown: "gold",
};

// Create an object containing some possible input values like "true" and "false"

const inputValues: Record<string, string> = {
    true: "green",
    false: "red",
    null: "red",
    undefined: "red"
}

export default function Input(options: InputParams) {

    const { param, inputs } = options;

    // const isRequired = (param?.ui?.required === false) ? false : true;
    const thisInput = inputs[param.name];
    const defaultValue = param?.ui?.default;
    const [is, value] = isJSON(thisInput?.value || defaultValue || "null");
    const mainValue = is ? JSON.stringify(value) : value;
    const type = thisInput?.type || param.type;

    if (param.type === "unknown") {
        param.typeChange = true;
    }

    return (
        <>
            <button
                onClick={() => options.store.events.push("openInputsDialog", {...options, param: { ...param, type }})}
                className="flex items-center gap-2 p-1.5 pl-3 pr-3 border-1 rounded-md text-xs hover:border-white/20 cursor-pointer min-w-[0] group"
            >
                <div className="flex items-center gap-1.5 w-full min-w-0 mr-2">
                    <Text size="1">{param.name}: </Text>
                    <Text size="1" color={inputValues[mainValue] as any || "gray"} className="truncate">
                        {mainValue}
                    </Text>
                </div>
                <div className="flex items-center gap-1">
                    <Text size="1" color={inputTypes[String(type)] as any}>
                        {String(type)}
                    </Text>
                </div>
                <div className="flex items-center justfy-center hidden group-hover:flex">
                    <Icon id="pencil" options={{ color: "gray" }} size="small" />
                </div>
            </button>
        </>
    )

}

export { inputTypes };