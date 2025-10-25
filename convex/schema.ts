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
		isAdmin: v.optional(v.boolean()),
		theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
	}).index("email", ["email"]),

	categories: defineTable({
		slug: v.string(),
		title: v.string(),
		subtitle: v.string(),
	})
		.index("by_slug", ["slug"])
		.searchIndex("search_title", {
			searchField: "title",
		}),

	pages: defineTable({
		slug: v.string(),
		title: v.string(),
		subtitle: v.string(),
		categoryId: v.id("categories"),
		markdown: v.string(),
	})
		.index("by_category", ["categoryId"])
		.index("by_slug", ["slug"])
		.index("by_category_and_slug", ["categoryId", "slug"])
		.searchIndex("search_content", {
			searchField: "title",
			filterFields: ["categoryId"],
		}),

	comments: defineTable({
		pageId: v.id("pages"),
		userId: v.id("users"),
		content: v.string(),
	})
		.index("by_page", ["pageId"])
		.index("by_user", ["userId"]),

	likes: defineTable({
		pageId: v.id("pages"),
		userId: v.optional(v.id("users")), // Optional to support anonymous likes
		sessionId: v.optional(v.string()), // For anonymous users
	})
		.index("by_page", ["pageId"])
		.index("by_user", ["userId"])
		.index("by_page_and_user", ["pageId", "userId"])
		.index("by_page_and_session", ["pageId", "sessionId"]),
})
