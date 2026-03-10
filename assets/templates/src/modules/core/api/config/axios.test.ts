import { describe, expect, test } from "vitest";

import { createExternalApiClient } from "./axios";

describe("createExternalApiClient", () => {
  test("creates an axios client with the provided baseURL", () => {
    const client = createExternalApiClient({
      baseURL: "https://example.com",
    });

    expect(client.defaults.baseURL).toBe("https://example.com");
    expect(client.defaults.timeout).toBe(10_000);
  });
});
