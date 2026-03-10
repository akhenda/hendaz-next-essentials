import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const createMessage = mutation({
  args: {
    body: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const body = args.body.trim();

    if (body.length === 0) {
      throw new Error("Message body is required");
    }

    return await ctx.db.insert("messages", {
      body,
      author: args.author,
      createdAt: Date.now(),
    });
  },
});
