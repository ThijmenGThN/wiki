import { v } from "convex/values"
import { query } from "./_generated/server"

// Settings queries
export const getSettings = query({
	handler: async (ctx) => {
		const settings = await ctx.db.query("settings").first()
		return settings || { sitename: "Wiki", subtitle: "Knowledge Base" }
	},
})

// Category queries
export const listCategories = query({
	handler: async (ctx) => {
		return await ctx.db.query("categories").collect()
	},
})

export const getCategoryBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.first()
	},
})

// Page queries
export const listPagesByCategory = query({
	args: { categorySlug: v.string() },
	handler: async (ctx, args) => {
		const category = await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.categorySlug))
			.first()

		if (!category) {
			return []
		}

		return await ctx.db
			.query("pages")
			.withIndex("by_category", (q) => q.eq("categoryId", category._id))
			.collect()
	},
})

export const getPageBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, args) => {
		const page = await ctx.db
			.query("pages")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.first()

		if (!page) {
			return null
		}

		const category = await ctx.db.get(page.categoryId)

		return {
			...page,
			category,
		}
	},
})

// Search functionality
export const searchPages = query({
	args: { searchTerm: v.string() },
	handler: async (ctx, args) => {
		if (args.searchTerm.length < 2) {
			return []
		}

		const results = await ctx.db
			.query("pages")
			.withSearchIndex("search_content", (q) => q.search("title", args.searchTerm))
			.take(4)

		// Fetch category information for each result
		const resultsWithCategory = await Promise.all(
			results.map(async (page) => {
				const category = await ctx.db.get(page.categoryId)
				return {
					...page,
					category,
				}
			}),
		)

		return resultsWithCategory
	},
})
