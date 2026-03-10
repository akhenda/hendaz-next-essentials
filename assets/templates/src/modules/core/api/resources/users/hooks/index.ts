"use client";

import { api } from "../../../../../../convex/_generated/api";
import { useAction, useMutation, useQuery } from "../../../convex";
import type { SaveUserProfileInput } from "../types";

export function useCurrentUserProfile() {
  return useQuery(api.queries.getCurrentUserProfile, {});
}

export function useSaveCurrentUserProfile() {
  const mutation = useMutation(api.mutations.saveCurrentUserProfile);

  return async (values: SaveUserProfileInput) => mutation(values);
}

export function useUserProfileSummaries() {
  return useAction(api.actions.summarizeUsers);
}
