import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";

import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

describe("convex queries example", () => {
  test("listMessages returns the newest messages first", async () => {
    const t = convexTest(schema, modules);

    await t.run(async (ctx) => {
      await ctx.db.insert("messages", {
        body: "First message",
        author: "Ada",
        createdAt: 1,
      });
      await ctx.db.insert("messages", {
        body: "Second message",
        author: "Grace",
        createdAt: 2,
      });
    });

    const messages = await t.query(api.queries.listMessages);

    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatchObject({
      body: "Second message",
      author: "Grace",
    });
  });

  test("countMessages returns the total number of stored messages", async () => {
    const t = convexTest(schema, modules);

    await t.run(async (ctx) => {
      await ctx.db.insert("messages", {
        body: "Count me",
        author: "Linus",
        createdAt: 1,
      });
    });

    const count = await t.query(api.queries.countMessages);

    expect(count).toBe(1);
  });
});
