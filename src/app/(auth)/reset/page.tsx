"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuthErrorMessage } from "@/lib/auth-errors"

export default function ResetPasswordForm() {
	const { signIn } = useAuthActions()
	const searchParams = useSearchParams()
	const [isLoading, setIsLoading] = useState(false)
	const [step, setStep] = useState<"request" | "verify">("request")
	const [email, setEmail] = useState("")
	const [token, setToken] = useState("")
	const [success, setSuccess] = useState(false)

	useEffect(() => {
		const tokenParam = searchParams.get("token")
		const emailParam = searchParams.get("email")

		if (tokenParam && emailParam) {
			setToken(tokenParam)
			setEmail(emailParam)
			setStep("verify")
		}
	}, [searchParams])

	const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)

		const formData = new FormData(e.target as HTMLFormElement)
		const emailValue = formData.get("email") as string

		formData.set("flow", "reset")

		try {
			await signIn("password", formData)
			// Show success message instead of switching to verify step
			setEmail(emailValue)
			setSuccess(true)
		} catch (error: unknown) {
			toast.error(getAuthErrorMessage(error))
		} finally {
			setIsLoading(false)
		}
	}

	const handleVerifyReset = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)

		const formData = new FormData(e.target as HTMLFormElement)
		const newPassword = formData.get("newPassword")
		const confirmPassword = formData.get("confirmPassword")

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match")
			setIsLoading(false)
			return
		}

		formData.set("flow", "reset-verification")
		formData.set("email", email)
		formData.set("code", token)

		try {
			await signIn("password", formData)
			setSuccess(true)
		} catch (error: unknown) {
			toast.error(getAuthErrorMessage(error))
		} finally {
			setIsLoading(false)
		}
	}

	if (success && step === "request") {
		return (
			<div className="space-y-4">
				<Button asChild variant="ghost" size="sm" className="self-start">
					<Link href="/login">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to login
					</Link>
				</Button>

				<Card>
					<CardContent className="pt-6">
						<div className="space-y-6 text-center">
							<div className="space-y-2">
								<h1 className="text-2xl font-bold text-foreground">Check your email</h1>
								<p className="text-muted-foreground">We sent a password reset link to {email}</p>
							</div>
							<Button asChild variant="outline" className="w-full">
								<Link href="/login">Back to login</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (success && step === "verify") {
		return (
			<div className="space-y-4">
				<Button asChild variant="ghost" size="sm" className="self-start">
					<Link href="/login">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to login
					</Link>
				</Button>

				<Card>
					<CardContent className="pt-6">
						<div className="space-y-6 text-center">
							<div className="space-y-2">
								<h1 className="text-2xl font-bold text-foreground">Password reset successful</h1>
								<p className="text-muted-foreground">You're all set, continue to login.</p>
							</div>
							<Button asChild className="w-full">
								<Link href="/login">Sign in with new password</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (step === "verify") {
		return (
			<div className="space-y-4">
				<Button asChild variant="ghost" size="sm" className="self-start">
					<Link href="/login">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to login
					</Link>
				</Button>

				<Card>
					<CardContent className="pt-6">
						<div className="space-y-6">
							<div className="text-center space-y-2">
								<h1 className="text-2xl font-bold text-foreground">Set new password</h1>
								<p className="text-muted-foreground">Enter your new password for {email}</p>
							</div>

							<form onSubmit={handleVerifyReset} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="newPassword">New Password</Label>
									<Input
										id="newPassword"
										name="newPassword"
										type="password"
										autoComplete="new-password"
										disabled={isLoading}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm New Password</Label>
									<Input
										id="confirmPassword"
										name="confirmPassword"
										type="password"
										autoComplete="new-password"
										disabled={isLoading}
										required
									/>
								</div>

								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Resetting password..." : "Reset password"}
								</Button>
							</form>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<Button asChild variant="ghost" size="sm" className="self-start">
				<Link href="/login">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to login
				</Link>
			</Button>

			<Card>
				<CardContent className="pt-6">
					<div className="space-y-6">
						<div className="text-center space-y-2">
							<h1 className="text-2xl font-bold text-foreground">Reset password</h1>
							<p className="text-muted-foreground">Enter your email to receive a reset link</p>
						</div>

						<form onSubmit={handleRequestReset} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									disabled={isLoading}
									required
								/>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Sending code..." : "Send reset code"}
							</Button>
						</form>

						<div className="text-center pt-4 border-t border-border">
							<p className="text-sm text-muted-foreground">
								Remember your password?{" "}
								<Link href="/login" className="text-primary hover:underline font-medium">
									Sign in
								</Link>
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
