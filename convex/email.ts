"use node"

import { render } from "@react-email/components"
import { v } from "convex/values"
import nodemailer from "nodemailer"
import Reset from "../src/emails/Reset"
import Verify from "../src/emails/Verify"
import { internalAction } from "./_generated/server"

export const sendPasswordResetEmail = internalAction({
	args: {
		email: v.string(),
		token: v.string(),
	},
	handler: async (_ctx, { email, token }) => {
		try {
			// Get the base URL from environment or construct it
			const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"

			// Construct the reset URL
			const resetUrl = `${domain}/reset?token=${token}&email=${encodeURIComponent(email)}`

			// Render the email template
			const emailHtml = await render(Reset({ ACTION_URL: resetUrl }))

			// Create transporter
			const transporter = nodemailer.createTransport({
				host: process.env.SMTP_HOST,
				port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			})

			// Send email
			const info = await transporter.sendMail({
				from: `"${process.env.MAIL_DEFAULT_NAME}" <${process.env.MAIL_DEFAULT_ADDRESS}>`,
				to: email,
				subject: "Reset your password",
				html: emailHtml,
			})

			console.log("Password reset email sent:", info.messageId)

			return {
				success: true,
				messageId: info.messageId,
			}
		} catch (error) {
			console.error("Error sending password reset email:", error)
			throw new Error(
				`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
			)
		}
	},
})

export const sendVerificationEmail = internalAction({
	args: {
		email: v.string(),
		token: v.string(),
	},
	handler: async (_ctx, { email, token }) => {
		try {
			// Get the base URL from environment or construct it
			const domain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"

			// Construct the verification URL
			const verifyUrl = `${domain}/verify?token=${token}&email=${encodeURIComponent(email)}`

			// Render the email template
			const emailHtml = await render(Verify({ ACTION_URL: verifyUrl }))

			// Create transporter
			const transporter = nodemailer.createTransport({
				host: process.env.SMTP_HOST,
				port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			})

			// Send email
			const info = await transporter.sendMail({
				from: `"${process.env.MAIL_DEFAULT_NAME}" <${process.env.MAIL_DEFAULT_ADDRESS}>`,
				to: email,
				subject: "Verify your email address",
				html: emailHtml,
			})

			console.log("Verification email sent:", info.messageId)

			return {
				success: true,
				messageId: info.messageId,
			}
		} catch (error) {
			console.error("Error sending verification email:", error)
			throw new Error(
				`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
			)
		}
	},
})
