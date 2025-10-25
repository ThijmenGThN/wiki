import { v } from "convex/values"
import { mutation } from "./_generated/server"

// Import a single category
export const importCategory = mutation({
	args: {
		title: v.string(),
		subtitle: v.string(),
		slug: v.string(),
		originalId: v.number(),
	},
	handler: async (ctx, args) => {
		// Check if category already exists
		const existing = await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.first()

		if (existing) {
			console.log(`Category ${args.slug} already exists, skipping`)
			return existing._id
		}

		// Insert the category
		const categoryId = await ctx.db.insert("categories", {
			title: args.title,
			subtitle: args.subtitle,
			slug: args.slug,
		})

		console.log(`Imported category: ${args.title} (${args.slug})`)
		return categoryId
	},
})

// Import a single page
export const importPage = mutation({
	args: {
		title: v.string(),
		subtitle: v.string(),
		slug: v.string(),
		markdown: v.string(),
		categorySlug: v.string(),
	},
	handler: async (ctx, args) => {
		// Find the category by slug
		const category = await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.categorySlug))
			.first()

		if (!category) {
			throw new Error(`Category not found: ${args.categorySlug}`)
		}

		// Check if page already exists
		const existing = await ctx.db
			.query("pages")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.first()

		if (existing) {
			console.log(`Page ${args.slug} already exists, skipping`)
			return existing._id
		}

		// Insert the page
		const pageId = await ctx.db.insert("pages", {
			title: args.title,
			subtitle: args.subtitle,
			slug: args.slug,
			markdown: args.markdown,
			categoryId: category._id,
		})

		console.log(`Imported page: ${args.title} (${args.slug}) in category ${args.categorySlug}`)
		return pageId
	},
})

// Clear all wiki data (useful for re-importing)
export const clearAllWikiData = mutation({
	handler: async (ctx) => {
		// Delete all pages
		const pages = await ctx.db.query("pages").collect()
		for (const page of pages) {
			await ctx.db.delete(page._id)
		}

		// Delete all categories
		const categories = await ctx.db.query("categories").collect()
		for (const category of categories) {
			await ctx.db.delete(category._id)
		}

		console.log(`Cleared ${pages.length} pages and ${categories.length} categories`)
		return { pagesDeleted: pages.length, categoriesDeleted: categories.length }
	},
})

// Initialize settings
export const initializeSettings = mutation({
	args: {
		sitename: v.string(),
		subtitle: v.string(),
		disclaimer: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db.query("settings").first()

		if (existing) {
			console.log("Settings already exist, skipping")
			return existing._id
		}

		const settingsId = await ctx.db.insert("settings", {
			sitename: args.sitename,
			subtitle: args.subtitle,
			disclaimer: args.disclaimer,
		})

		console.log("Initialized settings")
		return settingsId
	},
})
