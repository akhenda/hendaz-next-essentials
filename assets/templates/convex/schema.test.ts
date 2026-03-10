import { convexTest } from "convex-test";
import { expect, test } from "vitest";

import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

test("schema accepts example messages created by the mutation", async () => {
  const t = convexTest(schema, modules);

  await t.mutation(api.mutations.createMessage, {
    body: "Hello from schema test",
    author: "Skill",
  });

  const stored = await t.run(async (ctx) => {
    return await ctx.db.query("messages").collect();
  });

  expect(stored).toHaveLength(1);
  expect(stored[0]).toMatchObject({
    body: "Hello from schema test",
    author: "Skill",
  });
});
