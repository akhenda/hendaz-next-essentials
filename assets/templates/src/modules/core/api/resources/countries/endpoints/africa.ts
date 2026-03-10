import { createResourceClient } from "../../../config";
import type { RESTCountriesApiErrorResponse } from "../utils";

import type { Country } from "./types";

const countriesClient = createResourceClient({
  baseURL: "https://restcountries.com/v3.1",
});

export async function getAfricanCountries(options?: { signal?: AbortSignal }) {
  const response = await countriesClient.get<Country[]>("/region/africa", {
    signal: options?.signal,
  });

  return response.data;
}

export function toCountriesErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as Partial<RESTCountriesApiErrorResponse>;

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  return "Failed to fetch countries";
}
