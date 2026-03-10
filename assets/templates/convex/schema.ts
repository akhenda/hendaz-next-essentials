import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  appSettings: defineTable({
    accentColor: v.string(),
    locale: v.string(),
    reducedMotion: v.boolean(),
  }),
  messages: defineTable({
    body: v.string(),
    author: v.string(),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),
  users: defineTable({
    email: v.string(),
    name: v.string(),
  }),
});
