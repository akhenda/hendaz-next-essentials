import { describe, expect, test } from "vitest";

import { createQueryClient } from "./client";

describe("createQueryClient", () => {
  test("creates a client with Hendaz default query options", () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions();

    expect(defaults.queries?.retry).toBe(false);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaults.mutations?.retry).toBe(false);
  });
});
