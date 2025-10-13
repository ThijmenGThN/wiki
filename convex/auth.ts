import { Password } from "@convex-dev/auth/providers/Password"
import { Email } from "@convex-dev/auth/providers/Email"
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
})
