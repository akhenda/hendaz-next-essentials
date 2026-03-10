"use client";

import { api } from "../../../../../../convex/_generated/api";
import { useMutation, useQuery } from "../../../convex";
import type { UpdateAppSettingsInput } from "../types";

export function useAppSettings() {
  return useQuery(api.queries.getAppSettings, {});
}

export function useUpdateAppSettings() {
  const mutation = useMutation(api.mutations.updateAppSettings);

  return async (values: UpdateAppSettingsInput) => mutation(values);
}
