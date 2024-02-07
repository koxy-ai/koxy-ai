"use client";

import React, { useState } from "react";
import { Button } from "@radix-ui/themes";

type Props = {
  title?: string;
  action: Function;
  size?: any;
  color?: any;
  variant?: any;
  parameters?: Array<any>;
  children: React.JSX.Element;
};

export default function SubmitButton({
  title,
  action,
  size,
  color,
  variant,
  parameters,
  children,
}: Props) {
  const [state, setState] = useState("ready");

  const clickAction = async () => {
    if (state !== "loading") {
      try {
        setState("loading");
        await action(parameters || []);
        setState("ready");
      } catch (err: unknown) {
        setState("ready");
      }
    }
  };

  return (
    <>
      {state === "loading" ? (
        <Button
          size={size || "2"}
          color={color || "pink"}
          className="opacity-60"
          variant={variant || "surface"}
        >
          <i
            className="ti ti-loader"
            style={{
              fontSize: "medium",
              animation: "spinner 1s linear infinite",
            }}
          ></i>
          {children}
        </Button>
      ) : (
        <Button
          size={size || "2"}
          color={color || "pink"}
          variant={variant || "surface"}
          onClick={clickAction}
        >
          {children}
        </Button>
      )}
    </>
  );
}
