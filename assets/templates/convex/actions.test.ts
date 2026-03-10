import { convexTest } from "convex-test";
import { expect, test } from "vitest";

import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

test("summarizeMessages returns a newline-delimited summary", async () => {
  const t = convexTest(schema, modules);

  await t.run(async (ctx) => {
    await ctx.db.insert("messages", {
      body: "Message one",
      author: "Amina",
      createdAt: 1,
    });
    await ctx.db.insert("messages", {
      body: "Message two",
      author: "Brian",
      createdAt: 2,
    });
  });

  const summary = await t.action(api.actions.summarizeMessages, {
    limit: 2,
  });

  expect(summary).toContain("Brian: Message two");
  expect(summary).toContain("Amina: Message one");
});
