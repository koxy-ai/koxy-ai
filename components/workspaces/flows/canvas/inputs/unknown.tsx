import InputParams from "@/types/inputParams";
import { Badge, Text } from "@radix-ui/themes";
import { inputTypes } from "./inputs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import ChangeTypeDrop from "./changeTypeDrop";

interface UnknownParams {
  type: string;
  setType: (type: string) => void;
  param: InputParams["param"];
  continueAsType: (type: string) => void;
}

export default function Unknown({
  param,
  type,
  setType,
  continueAsType,
}: UnknownParams) {
  return (
    <div className="flex flex-col gap-2 h-[100%]">
      <Badge color={inputTypes[param.type] as any} className="max-w-max">
        unknown
      </Badge>
      <Text size="2" mb="2">
        Unknown input type
      </Text>
      <Text size="2" mb="4" color="gray" className="w-full max-w-[90%]">
        When the type is unknown, the input will be treated based on the{" "}
        <b>type you set</b>. It can be changed later, and it effects how the
        input is treated and displayed.
      </Text>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="opacity-80 bg-accent/80"
            >
              {type === "unknown" ? "Select type" : type}
              <Icon id="chevron-down" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <ChangeTypeDrop setType={setType} />
          </DropdownMenuContent>
        </DropdownMenu>
        {type !== "unknown" && (
          <Button onClick={() => continueAsType(type)} size="sm">
            Continue as {type}
          </Button>
        )}
      </div>
    </div>
  );
}
