"use client";

import { Heading } from "@radix-ui/themes";
import { useState } from "react";

const timer: { value: number; date: number } = {
  value: 0,
  date: 0,
};

export function openAlert(type: "error" | "success", msg: string) {
  // Get the alert elements
  const container = document.getElementById(`${type}AlertContainer`);
  const text = document.getElementById(`${type}AlertText`);
  if (!container || !text) {
    return undefined;
  }

  // Update the timer
  const date = Date.now();
  timer.value = 3000;
  timer.date = date;

  // Show the alert
  container.classList.remove("translate-y-[110%]", "opacity-0");
  text.innerText = msg;

  // Close the alert
  setTimeout(() => {
    if (timer.date === date) {
      closeAlert("error");
    }
  }, timer.value);
}

export function closeAlert(type: "error" | "success") {
  // Get the alert elements
  const container = document.getElementById(`${type}AlertContainer`);
  if (!container) {
    return undefined;
  }

  // Close the alert
  container.classList.add("translate-y-[110%]", "opacity-0");
}

export default function Alert() {
  return (
    <div>
      <div
        id="errorAlertContainer"
        className="errorContainer translate-y-[110%] opacity-0"
      >
        <Heading size="2" mb="2">
          Something went wrong
        </Heading>
        <p id="errorAlertText" className="text-xs text-gray-300"></p>
      </div>
      <div
        id="successAlertContainer"
        className="successContainer translate-y-[110%] opacity-0"
      >
        <Heading size="2" mb="2">
          Something went wrong
        </Heading>
        <p id="successAlertText" className="text-xs text-gray-300"></p>
      </div>
    </div>
  );
}
