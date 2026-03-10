import { query } from "./_generated/server";

export const listMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_created_at")
      .order("desc")
      .take(10);
  },
});

export const countMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    return messages.length;
  },
});

export const getAppSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("appSettings").first();

    if (settings) {
      return settings;
    }

    return {
      accentColor: "#0f766e",
      locale: "en",
      reducedMotion: false,
    };
  },
});

export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db.query("users").first();

    if (user) {
      return user;
    }

    return {
      _id: "demo-user",
      email: "demo@example.com",
      name: "Demo User",
    };
  },
});
