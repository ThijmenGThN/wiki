import { v } from "convex/values"
import type { MutationCtx, QueryCtx } from "./_generated/server"
import { mutation, query } from "./_generated/server"
import { auth } from "./auth"

// Helper to check if user is admin
async function requireAdmin(ctx: QueryCtx | MutationCtx) {
	const userId = await auth.getUserId(ctx)
	if (!userId) {
		throw new Error("Not authenticated")
	}

	const user = await ctx.db.get(userId)
	if (!user?.isAdmin) {
		throw new Error("Admin access required")
	}

	return userId
}

// ===== CATEGORY MANAGEMENT =====

export const createCategory = mutation({
	args: {
		slug: v.string(),
		title: v.string(),
		subtitle: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)

		// Check if slug already exists
		const existing = await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.first()

		if (existing) {
			throw new Error("A category with this slug already exists")
		}

		return await ctx.db.insert("categories", {
			slug: args.slug,
			title: args.title,
			subtitle: args.subtitle,
		})
	},
})

export const updateCategory = mutation({
	args: {
		id: v.id("categories"),
		slug: v.string(),
		title: v.string(),
		subtitle: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)

		// Check if new slug conflicts with another category
		const existing = await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.first()

		if (existing && existing._id !== args.id) {
			throw new Error("Another category with this slug already exists")
		}

		await ctx.db.patch(args.id, {
			slug: args.slug,
			title: args.title,
			subtitle: args.subtitle,
		})
	},
})

export const deleteCategory = mutation({
	args: { id: v.id("categories") },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)

		// Check if category has any pages
		const pages = await ctx.db
			.query("pages")
			.withIndex("by_category", (q) => q.eq("categoryId", args.id))
			.first()

		if (pages) {
			throw new Error("Cannot delete category with pages. Delete all pages first.")
		}

		await ctx.db.delete(args.id)
	},
})

// ===== PAGE MANAGEMENT =====

export const createPage = mutation({
	args: {
		slug: v.string(),
		title: v.string(),
		subtitle: v.string(),
		categoryId: v.id("categories"),
		markdown: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)

		// Check if slug already exists in this category
		const existing = await ctx.db
			.query("pages")
			.withIndex("by_category_and_slug", (q) =>
				q.eq("categoryId", args.categoryId).eq("slug", args.slug),
			)
			.first()

		if (existing) {
			throw new Error("A page with this slug already exists in this category")
		}

		return await ctx.db.insert("pages", {
			slug: args.slug,
			title: args.title,
			subtitle: args.subtitle,
			categoryId: args.categoryId,
			markdown: args.markdown,
		})
	},
})

export const updatePage = mutation({
	args: {
		id: v.id("pages"),
		slug: v.string(),
		title: v.string(),
		subtitle: v.string(),
		categoryId: v.id("categories"),
		markdown: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)

		// Check if new slug conflicts with another page in the same category
		const existing = await ctx.db
			.query("pages")
			.withIndex("by_category_and_slug", (q) =>
				q.eq("categoryId", args.categoryId).eq("slug", args.slug),
			)
			.first()

		if (existing && existing._id !== args.id) {
			throw new Error("Another page with this slug already exists in this category")
		}

		await ctx.db.patch(args.id, {
			slug: args.slug,
			title: args.title,
			subtitle: args.subtitle,
			categoryId: args.categoryId,
			markdown: args.markdown,
		})
	},
})

export const deletePage = mutation({
	args: { id: v.id("pages") },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)

		// Delete all comments for this page
		const comments = await ctx.db
			.query("comments")
			.withIndex("by_page", (q) => q.eq("pageId", args.id))
			.collect()

		for (const comment of comments) {
			await ctx.db.delete(comment._id)
		}

		// Delete all likes for this page
		const likes = await ctx.db
			.query("likes")
			.withIndex("by_page", (q) => q.eq("pageId", args.id))
			.collect()

		for (const like of likes) {
			await ctx.db.delete(like._id)
		}

		// Delete the page
		await ctx.db.delete(args.id)
	},
})

// ===== ADMIN QUERIES =====

export const getAllPages = query({
	handler: async (ctx) => {
		await requireAdmin(ctx)

		const pages = await ctx.db.query("pages").order("desc").collect()

		// Fetch category data for each page
		const pagesWithCategories = await Promise.all(
			pages.map(async (page) => {
				const category = await ctx.db.get(page.categoryId)
				return {
					...page,
					category,
				}
			}),
		)

		return pagesWithCategories
	},
})

export const getPageById = query({
	args: { id: v.id("pages") },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)

		const page = await ctx.db.get(args.id)
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

export const getCategoryById = query({
	args: { id: v.id("categories") },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		return await ctx.db.get(args.id)
	},
})
