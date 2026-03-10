"use client";

import type { PropsWithChildren } from "react";

import { ReactQueryProvider } from "./react-query";

export function APIProvider({ children }: PropsWithChildren) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
