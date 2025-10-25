import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { auth } from "./auth"

// ===== PUBLIC QUERIES =====

// Get all categories
export const getCategories = query({
	handler: async (ctx) => {
		return await ctx.db.query("categories").order("desc").collect()
	},
})

// Get a single category by slug
export const getCategoryBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.first()
	},
})

// Get pages by category slug with pagination
export const getPagesByCategory = query({
	args: {
		categorySlug: v.string(),
		paginationOpts: v.optional(v.object({ numItems: v.number(), cursor: v.optional(v.string()) })),
	},
	handler: async (ctx, args) => {
		const category = await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.categorySlug))
			.first()

		if (!category) {
			return { pages: [], category: null }
		}

		const pages = await ctx.db
			.query("pages")
			.withIndex("by_category", (q) => q.eq("categoryId", category._id))
			.order("desc")
			.collect()

		// Add like and comment counts
		const pagesWithCounts = await Promise.all(
			pages.map(async (page) => {
				const likeCount = await ctx.db
					.query("likes")
					.withIndex("by_page", (q) => q.eq("pageId", page._id))
					.collect()
				const commentCount = await ctx.db
					.query("comments")
					.withIndex("by_page", (q) => q.eq("pageId", page._id))
					.collect()
				return {
					...page,
					likeCount: likeCount.length,
					commentCount: commentCount.length,
				}
			}),
		)

		return { pages: pagesWithCounts, category }
	},
})

// Get a single page by category slug and page slug
export const getPageBySlug = query({
	args: {
		categorySlug: v.string(),
		pageSlug: v.string(),
	},
	handler: async (ctx, args) => {
		const category = await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.categorySlug))
			.first()

		if (!category) {
			return null
		}

		const page = await ctx.db
			.query("pages")
			.withIndex("by_category_and_slug", (q) =>
				q.eq("categoryId", category._id).eq("slug", args.pageSlug),
			)
			.first()

		if (!page) {
			return null
		}

		return {
			...page,
			category,
		}
	},
})

// Search pages by title
export const searchPages = query({
	args: { searchTerm: v.string() },
	handler: async (ctx, args) => {
		if (!args.searchTerm || args.searchTerm.trim().length === 0) {
			return []
		}

		// Get all pages and filter with relevance scoring
		const allPages = await ctx.db.query("pages").collect()
		const searchLower = args.searchTerm.toLowerCase().trim()

		// Score each page based on relevance
		const scoredPages = allPages
			.map((page) => {
				const titleLower = page.title.toLowerCase()
				const subtitleLower = page.subtitle.toLowerCase()
				let score = 0

				// Exact match in title (highest priority)
				if (titleLower === searchLower) {
					score += 100
				}
				// Starts with search term in title
				else if (titleLower.startsWith(searchLower)) {
					score += 50
				}
				// Contains whole word match in title
				else if (titleLower.split(/\s+/).some((word) => word === searchLower)) {
					score += 30
				}
				// Contains search term in title
				else if (titleLower.includes(searchLower)) {
					score += 10
				}

				// Same for subtitle (lower priority)
				if (subtitleLower === searchLower) {
					score += 20
				} else if (subtitleLower.startsWith(searchLower)) {
					score += 10
				} else if (subtitleLower.split(/\s+/).some((word) => word === searchLower)) {
					score += 5
				} else if (subtitleLower.includes(searchLower)) {
					score += 2
				}

				return { page, score }
			})
			.filter((item) => item.score > 0) // Only include pages with matches
			.sort((a, b) => b.score - a.score) // Sort by relevance
			.slice(0, 20)
			.map((item) => item.page)

		// Fetch category data for each result
		const pagesWithCategories = await Promise.all(
			scoredPages.map(async (page) => {
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

// Search pages within a specific category
export const searchPagesByCategory = query({
	args: {
		categorySlug: v.string(),
		searchTerm: v.string(),
	},
	handler: async (ctx, args) => {
		if (!args.searchTerm || args.searchTerm.trim().length === 0) {
			return []
		}

		const category = await ctx.db
			.query("categories")
			.withIndex("by_slug", (q) => q.eq("slug", args.categorySlug))
			.first()

		if (!category) {
			return []
		}

		const results = await ctx.db
			.query("pages")
			.withSearchIndex("search_content", (q) =>
				q.search("title", args.searchTerm).eq("categoryId", category._id),
			)
			.take(20)

		// Add like and comment counts
		const pagesWithCounts = await Promise.all(
			results.map(async (page) => {
				const likeCount = await ctx.db
					.query("likes")
					.withIndex("by_page", (q) => q.eq("pageId", page._id))
					.collect()
				const commentCount = await ctx.db
					.query("comments")
					.withIndex("by_page", (q) => q.eq("pageId", page._id))
					.collect()
				return {
					...page,
					likeCount: likeCount.length,
					commentCount: commentCount.length,
				}
			}),
		)

		return pagesWithCounts
	},
})

// Get recent pages
export const getRecentPages = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const limit = args.limit ?? 10
		const pages = await ctx.db.query("pages").order("desc").take(limit)

		// Fetch category data, like count, and comment count for each page
		const pagesWithData = await Promise.all(
			pages.map(async (page) => {
				const category = await ctx.db.get(page.categoryId)
				const likeCount = await ctx.db
					.query("likes")
					.withIndex("by_page", (q) => q.eq("pageId", page._id))
					.collect()
				const commentCount = await ctx.db
					.query("comments")
					.withIndex("by_page", (q) => q.eq("pageId", page._id))
					.collect()
				return {
					...page,
					category,
					likeCount: likeCount.length,
					commentCount: commentCount.length,
				}
			}),
		)

		return pagesWithData
	},
})

// Get most liked pages
export const getMostLikedPages = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const limit = args.limit ?? 10
		const pages = await ctx.db.query("pages").collect()

		// Fetch category data, like count, and comment count for each page
		const pagesWithData = await Promise.all(
			pages.map(async (page) => {
				const category = await ctx.db.get(page.categoryId)
				const likeCount = await ctx.db
					.query("likes")
					.withIndex("by_page", (q) => q.eq("pageId", page._id))
					.collect()
				const commentCount = await ctx.db
					.query("comments")
					.withIndex("by_page", (q) => q.eq("pageId", page._id))
					.collect()
				return {
					...page,
					category,
					likeCount: likeCount.length,
					commentCount: commentCount.length,
				}
			}),
		)

		// Sort by like count in descending order and take the top N
		return pagesWithData.sort((a, b) => b.likeCount - a.likeCount).slice(0, limit)
	},
})

// Get comments for a page
export const getComments = query({
	args: { pageId: v.id("pages") },
	handler: async (ctx, args) => {
		const comments = await ctx.db
			.query("comments")
			.withIndex("by_page", (q) => q.eq("pageId", args.pageId))
			.order("desc")
			.collect()

		// Fetch user data for each comment
		const commentsWithUsers = await Promise.all(
			comments.map(async (comment) => {
				const user = await ctx.db.get(comment.userId)
				return {
					...comment,
					user: user
						? {
								_id: user._id,
								name: user.name,
								image: user.image,
							}
						: null,
				}
			}),
		)

		return commentsWithUsers
	},
})

// Get like count for a page
export const getLikeCount = query({
	args: { pageId: v.id("pages") },
	handler: async (ctx, args) => {
		const likes = await ctx.db
			.query("likes")
			.withIndex("by_page", (q) => q.eq("pageId", args.pageId))
			.collect()

		return likes.length
	},
})

// Check if current user/session has liked a page
export const hasUserLikedPage = query({
	args: {
		pageId: v.id("pages"),
		sessionId: v.optional(v.string()), // For anonymous users
	},
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx)

		let like

		if (userId) {
			// Authenticated user - check by userId
			like = await ctx.db
				.query("likes")
				.withIndex("by_page_and_user", (q) => q.eq("pageId", args.pageId).eq("userId", userId))
				.first()
		} else if (args.sessionId) {
			// Anonymous user - check by sessionId
			like = await ctx.db
				.query("likes")
				.withIndex("by_page_and_session", (q) => q.eq("pageId", args.pageId).eq("sessionId", args.sessionId))
				.first()
		} else {
			return false
		}

		return !!like
	},
})

// ===== AUTHENTICATED MUTATIONS =====

// Toggle like on a page (supports both authenticated and anonymous users)
export const toggleLike = mutation({
	args: {
		pageId: v.id("pages"),
		sessionId: v.optional(v.string()), // For anonymous users
	},
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx)

		// Need either userId or sessionId
		if (!userId && !args.sessionId) {
			throw new Error("Session ID required for anonymous likes")
		}

		let existingLike

		if (userId) {
			// Authenticated user - check by userId
			existingLike = await ctx.db
				.query("likes")
				.withIndex("by_page_and_user", (q) => q.eq("pageId", args.pageId).eq("userId", userId))
				.first()
		} else {
			// Anonymous user - check by sessionId
			existingLike = await ctx.db
				.query("likes")
				.withIndex("by_page_and_session", (q) => q.eq("pageId", args.pageId).eq("sessionId", args.sessionId))
				.first()
		}

		if (existingLike) {
			// Unlike
			await ctx.db.delete(existingLike._id)
			return { liked: false }
		}

		// Like
		await ctx.db.insert("likes", {
			pageId: args.pageId,
			userId: userId || undefined,
			sessionId: !userId ? args.sessionId : undefined,
		})
		return { liked: true }
	},
})

// Add a comment to a page
export const addComment = mutation({
	args: {
		pageId: v.id("pages"),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx)
		if (!userId) {
			throw new Error("Must be logged in to comment")
		}

		if (!args.content.trim()) {
			throw new Error("Comment cannot be empty")
		}

		const commentId = await ctx.db.insert("comments", {
			pageId: args.pageId,
			userId,
			content: args.content.trim(),
		})

		return commentId
	},
})

// Delete a comment (only the author can delete)
export const deleteComment = mutation({
	args: { commentId: v.id("comments") },
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx)
		if (!userId) {
			throw new Error("Must be logged in to delete comments")
		}

		const comment = await ctx.db.get(args.commentId)
		if (!comment) {
			throw new Error("Comment not found")
		}

		if (comment.userId !== userId) {
			// Check if user is admin
			const user = await ctx.db.get(userId)
			if (!user?.isAdmin) {
				throw new Error("You can only delete your own comments")
			}
		}

		await ctx.db.delete(args.commentId)
	},
})
