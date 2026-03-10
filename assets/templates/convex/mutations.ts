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

export const updateAppSettings = mutation({
  args: {
    accentColor: v.optional(v.string()),
    locale: v.optional(v.string()),
    reducedMotion: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("appSettings").first();
    const nextValues = {
      accentColor: args.accentColor ?? existing?.accentColor ?? "#0f766e",
      locale: args.locale ?? existing?.locale ?? "en",
      reducedMotion: args.reducedMotion ?? existing?.reducedMotion ?? false,
    };

    if (existing) {
      await ctx.db.patch(existing._id, nextValues);
      return existing._id;
    }

    return await ctx.db.insert("appSettings", nextValues);
  },
});

export const saveCurrentUserProfile = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("users").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("users", args);
  },
});
