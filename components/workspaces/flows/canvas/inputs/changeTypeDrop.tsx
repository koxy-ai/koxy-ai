import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { inputTypes } from "./inputs";
import { Text } from "@radix-ui/themes";

export default function ChangeTypeDrop({
  setType,
}: {
  setType: (type: string) => void;
}) {
  return (
    <>
      {Object.keys(inputTypes)
        .filter((type) => type !== "unknown")
        .map((type) => (
          <DropdownMenuItem
            key={type}
            onClick={() => {
              setType(type);
            }}
          >
            <Text size="2" color={inputTypes[type] as any}>
              {type}
            </Text>
          </DropdownMenuItem>
        ))}
    </>
  );
}
