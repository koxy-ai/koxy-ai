"use client";

import { MainIcon } from "@/components/Icon";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Text } from "@radix-ui/themes";
import { inputTypes } from "./inputs";
import { Button } from "@/components/ui/button";

export default function EditType({
  value,
  setType,
}: {
  value: unknown;
  setType: (type: string) => void;
}) {
  const [isAllowed, setIsAllowed] = useState(
    !value || value === "" ? true : false,
  );

  if (!isAllowed) {
    return (
      <div className="w-full p-6 pt-2 flex flex-col items-center justify-center">
        <MainIcon icon="alert-circle" color="red" />
        <Text
          color="red"
          size="2"
          className="text-center text-xs"
          align="center"
        >
          Changing the type will reset the input value
        </Text>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setIsAllowed(true);
          }}
          className="opacity-80 bg-accent/80 mt-4"
        >
          Continue
        </Button>
      </div>
    );
  }

  return (
    <>
      {isAllowed &&
        Object.keys(inputTypes)
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
