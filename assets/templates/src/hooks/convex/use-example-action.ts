"use client";

import { useAction } from "convex/react";

import { api } from "../../../convex/_generated/api";

export function useSummarizeExampleMessages() {
  return useAction(api.actions.summarizeMessages);
}
