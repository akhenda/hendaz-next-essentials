import type { AxiosInstance } from "axios";

import { createExternalApiClient } from "./axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const apiClient = createExternalApiClient({
  baseURL,
});

export function createResourceClient(config: { baseURL: string }): AxiosInstance {
  return createExternalApiClient(config);
}
