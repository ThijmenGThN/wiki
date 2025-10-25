"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { ArrowLeft, Github } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuthErrorMessage } from "@/lib/auth-errors"

interface LoginFormData {
	email: string
	password: string
}

export default function LoginForm() {
	const { signIn } = useAuthActions()
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>()

	const login = async (data: LoginFormData) => {
		setIsLoading(true)
		try {
			const formData = new FormData()
			formData.set("email", data.email)
			formData.set("password", data.password)
			formData.set("flow", "signIn")

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
							<h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
							<p className="text-muted-foreground">Sign in to your account</p>
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

						<form onSubmit={handleSubmit(login)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									autoComplete="email"
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "Invalid email address",
										},
									})}
									disabled={isLoading}
								/>
								{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Password</Label>
									<Link href="/reset" className="text-sm text-primary hover:underline">
										Forgot password?
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									autoComplete="current-password"
									{...register("password", { required: "Password is required" })}
									disabled={isLoading}
								/>
								{errors.password && (
									<p className="text-sm text-destructive">{errors.password.message}</p>
								)}
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Signing in..." : "Sign in"}
							</Button>
						</form>

						<div className="text-center pt-4 border-t border-border">
							<p className="text-sm text-muted-foreground">
								Don&apos;t have an account?{" "}
								<Link href="/register" className="text-primary hover:underline font-medium">
									Create account
								</Link>
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
