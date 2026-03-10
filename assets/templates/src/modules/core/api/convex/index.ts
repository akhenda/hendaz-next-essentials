"use client";

import { useQueries } from "convex/react";
import { makeUseQueryWithStatus } from "convex-helpers/react";
import {
  useQueries as useQueriesWithCache,
  useQuery as useQueryWithCache,
} from "convex-helpers/react/cache/hooks";

export {
  useAction,
  useConvex,
  useMutation,
  usePaginatedQuery,
  useQueries,
  useQuery,
} from "convex/react";

export { useQueriesWithCache, useQueryWithCache };

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);
export const useQueryWithStatusAndCache =
  makeUseQueryWithStatus(useQueriesWithCache);

export * from "./provider";
