"use client";

import { useQuery } from "convex/react";

import { api } from "../../../convex/_generated/api";

export function useExampleMessages() {
  return useQuery(api.queries.listMessages);
}

export function useExampleMessageCount() {
  return useQuery(api.queries.countMessages);
}
