"use client";

import { useMutation } from "convex/react";

import { api } from "../../../convex/_generated/api";

export function useCreateExampleMessage() {
  return useMutation(api.mutations.createMessage);
}
