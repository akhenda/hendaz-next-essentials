"use client";

import { useQuery } from "@tanstack/react-query";

import { getAfricanCountries } from "../endpoints";
import { countriesQueryKeys } from "../utils";

export function useAfricanCountries() {
  return useQuery({
    queryKey: countriesQueryKeys.africa(),
    queryFn: ({ signal }) => getAfricanCountries({ signal }),
  });
}
