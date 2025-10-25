"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthActions } from "@convex-dev/auth/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { getAuthErrorMessage } from "@/lib/auth-errors"

interface AuthDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	message?: string
}

interface LoginFormData {
	email: string
	password: string
}

interface RegisterFormData {
	name: string
	email: string
	password: string
	confirmPassword: string
}

export function AuthDialog({ open, onOpenChange, message }: AuthDialogProps) {
	const { signIn } = useAuthActions()
	const [isLoading, setIsLoading] = useState(false)
	const [activeTab, setActiveTab] = useState<"login" | "register">("login")

	const loginForm = useForm<LoginFormData>()
	const registerForm = useForm<RegisterFormData>()

	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true)
		try {
			const formData = new FormData()
			formData.set("email", data.email)
			formData.set("password", data.password)
			formData.set("flow", "signIn")

			await signIn("password", formData)
			onOpenChange(false)
			toast.success("Successfully logged in!")
		} catch (error: unknown) {
			toast.error(getAuthErrorMessage(error))
		} finally {
			setIsLoading(false)
		}
	}

	const handleRegister = async (data: RegisterFormData) => {
		if (data.password !== data.confirmPassword) {
			toast.error("Passwords do not match")
			return
		}

		setIsLoading(true)
		try {
			const formData = new FormData()
			formData.set("name", data.name)
			formData.set("email", data.email)
			formData.set("password", data.password)
			formData.set("flow", "signUp")

			await signIn("password", formData)
			onOpenChange(false)
			toast.success("Account created successfully!")
		} catch (error: unknown) {
			toast.error(getAuthErrorMessage(error))
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Authentication Required</DialogTitle>
					<DialogDescription>
						{message || "You need to be logged in to perform this action."}
					</DialogDescription>
				</DialogHeader>

				<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="mt-4">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="login">Login</TabsTrigger>
						<TabsTrigger value="register">Register</TabsTrigger>
					</TabsList>

					<TabsContent value="login" className="space-y-4">
						<form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="login-email">Email</Label>
								<Input
									id="login-email"
									type="email"
									autoComplete="email"
									{...loginForm.register("email", {
										required: "Email is required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "Invalid email address",
										},
									})}
									disabled={isLoading}
								/>
								{loginForm.formState.errors.email && (
									<p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="login-password">Password</Label>
								<Input
									id="login-password"
									type="password"
									autoComplete="current-password"
									{...loginForm.register("password", { required: "Password is required" })}
									disabled={isLoading}
								/>
								{loginForm.formState.errors.password && (
									<p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
								)}
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Signing in..." : "Sign in"}
							</Button>
						</form>
					</TabsContent>

					<TabsContent value="register" className="space-y-4">
						<form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="register-name">Name</Label>
								<Input
									id="register-name"
									type="text"
									{...registerForm.register("name", { required: "Name is required" })}
									disabled={isLoading}
								/>
								{registerForm.formState.errors.name && (
									<p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="register-email">Email</Label>
								<Input
									id="register-email"
									type="email"
									autoComplete="email"
									{...registerForm.register("email", {
										required: "Email is required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "Invalid email address",
										},
									})}
									disabled={isLoading}
								/>
								{registerForm.formState.errors.email && (
									<p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="register-password">Password</Label>
								<Input
									id="register-password"
									type="password"
									autoComplete="new-password"
									{...registerForm.register("password", { required: "Password is required" })}
									disabled={isLoading}
								/>
								{registerForm.formState.errors.password && (
									<p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="register-confirm">Confirm Password</Label>
								<Input
									id="register-confirm"
									type="password"
									autoComplete="new-password"
									{...registerForm.register("confirmPassword", { required: "Please confirm your password" })}
									disabled={isLoading}
								/>
								{registerForm.formState.errors.confirmPassword && (
									<p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
								)}
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Creating account..." : "Create account"}
							</Button>
						</form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
