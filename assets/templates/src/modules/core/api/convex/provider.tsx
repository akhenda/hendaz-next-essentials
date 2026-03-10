"use client";

import type { PropsWithChildren } from "react";

import {
  ConvexProvider as ConvexReactProvider,
  ConvexReactClient,
} from "convex/react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";

let convexClient: ConvexReactClient | null = null;

function getConvexClient() {
  if (convexClient) {
    return convexClient;
  }

  const url = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!url) {
    return null;
  }

  convexClient = new ConvexReactClient(url);

  return convexClient;
}

export function ConvexProvider({ children }: PropsWithChildren) {
  const client = getConvexClient();

  if (!client) {
    return <>{children}</>;
  }

  return (
    <ConvexReactProvider client={client}>
      <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
    </ConvexReactProvider>
  );
}
