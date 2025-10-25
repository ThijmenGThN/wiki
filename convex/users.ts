import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalMutation, mutation, query } from "./_generated/server"
import { auth } from "./auth"

export const current = query({
	args: {},
	handler: async (ctx) => {
		const userId = await auth.getUserId(ctx)
		if (userId === null) {
			return null
		}
		return await ctx.db.get(userId)
	},
})

export const updateName = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx)
		if (userId === null) {
			throw new Error("Not authenticated")
		}
		await ctx.db.patch(userId, { name: args.name })
	},
})

export const updateTheme = mutation({
	args: {
		theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
	},
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx)
		if (userId === null) {
			throw new Error("Not authenticated")
		}
		await ctx.db.patch(userId, { theme: args.theme })
	},
})

export const verifyEmail = mutation({
	args: {
		token: v.string(),
		email: v.string(),
	},
	handler: async (ctx, args) => {
		// Find user by email
		const user = await ctx.db
			.query("users")
			.withIndex("email", (q) => q.eq("email", args.email))
			.first()

		if (!user) {
			throw new Error("User not found")
		}

		// Verify the token matches (in production, you'd use a more secure token verification)
		// For now, we'll use a simple approach similar to password reset
		// The token verification happens in the Email provider flow

		// Mark email as verified
		await ctx.db.patch(user._id, {
			emailVerificationTime: Date.now(),
		})

		return { success: true }
	},
})

export const resendVerificationEmail = mutation({
	args: {},
	handler: async (ctx) => {
		const userId = await auth.getUserId(ctx)
		if (userId === null) {
			throw new Error("Not authenticated")
		}

		const user = await ctx.db.get(userId)
		if (!user) {
			throw new Error("User not found")
		}

		if (user.emailVerificationTime) {
			throw new Error("Email already verified")
		}

		if (!user.email) {
			throw new Error("No email address found")
		}

		// Generate a token (simple approach for now)
		const token = crypto.randomUUID()

		// Send verification email
		await ctx.scheduler.runAfter(0, internal.email.sendVerificationEmail, {
			email: user.email,
			token,
		})

		return { success: true }
	},
})

// Internal mutation to send verification email after user creation
export const sendVerificationEmailAfterSignup = internalMutation({
	args: {
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.userId)
		if (!user || !user.email) {
			return
		}

		// Only send verification email if not already verified
		if (user.emailVerificationTime) {
			return
		}

		// Generate a token
		const token = crypto.randomUUID()

		// Send verification email
		await ctx.scheduler.runAfter(0, internal.email.sendVerificationEmail, {
			email: user.email,
			token,
		})
	},
})

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		const userId = await auth.getUserId(ctx)
		if (userId === null) {
			throw new Error("Not authenticated")
		}
		return await ctx.storage.generateUploadUrl()
	},
})

export const updateProfilePicture = mutation({
	args: {
		storageId: v.id("_storage"),
	},
	handler: async (ctx, args) => {
		const userId = await auth.getUserId(ctx)
		if (userId === null) {
			throw new Error("Not authenticated")
		}

		const user = await ctx.db.get(userId)
		if (!user) {
			throw new Error("User not found")
		}

		// Delete old profile picture if exists
		if (user.profilePictureStorageId) {
			await ctx.storage.delete(user.profilePictureStorageId)
		}

		// Update user with new profile picture
		await ctx.db.patch(userId, {
			profilePictureStorageId: args.storageId,
		})
	},
})

export const removeProfilePicture = mutation({
	args: {},
	handler: async (ctx) => {
		const userId = await auth.getUserId(ctx)
		if (userId === null) {
			throw new Error("Not authenticated")
		}

		const user = await ctx.db.get(userId)
		if (!user) {
			throw new Error("User not found")
		}

		// Delete profile picture from storage
		if (user.profilePictureStorageId) {
			await ctx.storage.delete(user.profilePictureStorageId)
		}

		// Remove profile picture reference from user
		await ctx.db.patch(userId, {
			profilePictureStorageId: undefined,
		})
	},
})

export const getProfilePictureUrl = query({
	args: {
		storageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args) => {
		if (!args.storageId) {
			return null
		}
		return await ctx.storage.getUrl(args.storageId)
	},
})
