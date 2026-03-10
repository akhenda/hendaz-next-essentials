import axios from "axios";
import type { AxiosInstance, CreateAxiosDefaults } from "axios";

const DEFAULT_TIMEOUT_MS = 10_000;

export function createExternalApiClient(
  config: CreateAxiosDefaults = {},
): AxiosInstance {
  return axios.create({
    timeout: DEFAULT_TIMEOUT_MS,
    headers: {
      "Content-Type": "application/json",
      ...(config.headers ?? {}),
    },
    ...config,
  });
}
