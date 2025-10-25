"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { ArrowLeft, Github } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuthErrorMessage } from "@/lib/auth-errors"

export default function RegisterForm() {
	const { signIn } = useAuthActions()
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)

		const formData = new FormData(e.target as HTMLFormElement)
		const password = formData.get("password")
		const confirmPassword = formData.get("confirmPassword")

		if (password !== confirmPassword) {
			toast.error("Passwords do not match")
			setIsLoading(false)
			return
		}

		formData.set("flow", "signUp")

		try {
			await signIn("password", formData)
		} catch (error: unknown) {
			toast.error(getAuthErrorMessage(error))
		} finally {
			setIsLoading(false)
		}
	}

	const handleGitHubSignIn = async () => {
		setIsLoading(true)
		try {
			await signIn("github")
		} catch (error: unknown) {
			toast.error(getAuthErrorMessage(error))
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-4">
			<Button asChild variant="ghost" size="sm" className="self-start">
				<Link href="/">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to home
				</Link>
			</Button>

			<Card>
				<CardContent className="pt-6">
					<div className="space-y-6">
						<div className="text-center space-y-2">
							<h1 className="text-2xl font-bold text-foreground">Create account</h1>
							<p className="text-muted-foreground">Sign up for a new account</p>
						</div>

						<Button
							type="button"
							variant="outline"
							className="w-full"
							onClick={handleGitHubSignIn}
							disabled={isLoading}
						>
							<Github className="h-4 w-4 mr-2" />
							Continue with GitHub
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-border" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-card px-2 text-muted-foreground">Or continue with</span>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input id="name" name="name" type="text" disabled={isLoading} required />
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" name="email" type="email" disabled={isLoading} required />
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									disabled={isLoading}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									disabled={isLoading}
									required
								/>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Creating account..." : "Create account"}
							</Button>
						</form>

						<div className="text-center pt-4 border-t border-border">
							<p className="text-sm text-muted-foreground">
								Already have an account?{" "}
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
