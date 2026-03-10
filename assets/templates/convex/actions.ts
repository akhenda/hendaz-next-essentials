import { v } from "convex/values";

import { api } from "./_generated/api";
import { action } from "./_generated/server";

export const summarizeMessages = action({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.runQuery(api.queries.listMessages);
    const selected = messages.slice(0, args.limit ?? 3);

    return selected.map(({ author, body }) => `${author}: ${body}`).join("\n");
  },
});

export const summarizeUsers = action({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.queries.getCurrentUserProfile);

    return `${user.name} <${user.email}>`;
  },
});
