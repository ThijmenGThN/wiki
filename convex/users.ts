import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
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
