import { Password } from "@convex-dev/auth/providers/Password"
import { Email } from "@convex-dev/auth/providers/Email"
import GitHub from "@auth/core/providers/github"
import { convexAuth } from "@convex-dev/auth/server"
import { internal } from "./_generated/api"

const EmailPasswordReset = Email({
	// @ts-expect-error - Convex Auth passes ctx as second parameter even though it's not in Auth.js types
	async sendVerificationRequest(params, ctx) {
		const { identifier: email, token } = params

		try {
			await ctx.runAction(internal.email.sendPasswordResetEmail, {
				email,
				token,
			})
			console.log("Password reset email request sent for:", email)
		} catch (error) {
			console.error("Error sending password reset email:", error)
			throw new Error(
				`Failed to send password reset email: ${error instanceof Error ? error.message : "Unknown error"}`,
			)
		}
	},
})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [
		GitHub,
		Password({
			reset: EmailPasswordReset,
			profile(params) {
				return {
					email: params.email as string,
					name: params.name as string,
				}
			},
		}),
	],
	callbacks: {
		redirect: async ({ redirectTo }) => {
			const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"
			const path = redirectTo || "/dash"
			// If redirectTo is already a full URL, return it as-is
			if (path.startsWith("http://") || path.startsWith("https://")) {
				return path
			}
			// Otherwise, prepend the frontend domain
			return `${baseUrl}${path}`
		},
		async afterUserCreatedOrUpdated(ctx, args) {
			// Send verification email only for password-based signups (not OAuth)
			if (args.existingUserId === undefined && args.profile.email) {
				// New user created with password provider
				const user = await ctx.db.get(args.userId)
				if (user && !user.emailVerificationTime && user.email) {
					// Schedule verification email to be sent
					await ctx.scheduler.runAfter(0, internal.users.sendVerificationEmailAfterSignup, {
						userId: args.userId,
					})
				}
			}

			// Save OAuth profile image (e.g., from GitHub)
			if (args.profile.image && typeof args.profile.image === "string") {
				const user = await ctx.db.get(args.userId)
				// Only update if user doesn't have an image set yet
				if (user && !user.image) {
					await ctx.db.patch(args.userId, {
						image: args.profile.image,
					})
				}
			}
		},
	},
})
