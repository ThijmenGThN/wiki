import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
	...authTables,
	users: defineTable({
		name: v.optional(v.string()),
		email: v.optional(v.string()),
		emailVerificationTime: v.optional(v.number()),
		phone: v.optional(v.string()),
		phoneVerificationTime: v.optional(v.number()),
		image: v.optional(v.string()),
		profilePictureStorageId: v.optional(v.id("_storage")),
		isAnonymous: v.optional(v.boolean()),
		theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
	}).index("email", ["email"]),
})
