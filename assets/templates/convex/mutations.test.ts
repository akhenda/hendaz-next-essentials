import { convexTest } from "convex-test";
import { expect, test } from "vitest";

import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

test("createMessage stores a trimmed message", async () => {
  const t = convexTest(schema, modules);

  await t.mutation(api.mutations.createMessage, {
    body: "  Trim me  ",
    author: "Tina",
  });

  const messages = await t.query(api.queries.listMessages);

  expect(messages[0]).toMatchObject({
    body: "Trim me",
    author: "Tina",
  });
});

test("createMessage rejects blank message bodies", async () => {
  const t = convexTest(schema, modules);

  await expect(
    t.mutation(api.mutations.createMessage, {
      body: "   ",
      author: "Tina",
    }),
  ).rejects.toThrowError("Message body is required");
});
