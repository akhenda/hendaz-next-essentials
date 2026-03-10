"use client";

import type { PropsWithChildren } from "react";

import { ConvexProvider } from "./convex";
import { ReactQueryProvider } from "./react-query";

export function APIProvider({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <ConvexProvider>{children}</ConvexProvider>
    </ReactQueryProvider>
  );
}
