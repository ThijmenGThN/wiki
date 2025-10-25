"use client"

import { useMutation } from "convex/react"
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function VerifyPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const verifyEmail = useMutation(api.users.verifyEmail)
	const resendVerificationEmail = useMutation(api.users.resendVerificationEmail)
	const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
	const [errorMessage, setErrorMessage] = useState("")
	const [resending, setResending] = useState(false)
	const [resendSuccess, setResendSuccess] = useState(false)

	useEffect(() => {
		const token = searchParams.get("token")
		const email = searchParams.get("email")

		if (!token || !email) {
			setStatus("error")
			setErrorMessage("Invalid verification link. Please check your email and try again.")
			return
		}

		const verify = async () => {
			try {
				await verifyEmail({ token, email })
				setStatus("success")
				// Redirect to dashboard after 2 seconds
				setTimeout(() => {
					router.push("/dash")
				}, 2000)
			} catch (error) {
				setStatus("error")
				setErrorMessage(error instanceof Error ? error.message : "Verification failed")
			}
		}

		verify()
	}, [searchParams, verifyEmail, router])

	const handleResendEmail = async () => {
		setResending(true)
		setResendSuccess(false)
		try {
			await resendVerificationEmail()
			setResendSuccess(true)
		} catch (error) {
			console.error("Failed to resend verification email:", error)
		} finally {
			setResending(false)
		}
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardContent className="pt-6">
					<div className="space-y-6">
						<div className="text-center space-y-4">
							{status === "loading" && (
								<>
									<div className="flex justify-center">
										<Loader2 className="h-16 w-16 text-primary animate-spin" />
									</div>
									<h1 className="text-2xl font-bold text-foreground">Verifying your email</h1>
									<p className="text-muted-foreground">
										Please wait while we verify your email address...
									</p>
								</>
							)}

							{status === "success" && (
								<>
									<div className="flex justify-center">
										<CheckCircle2 className="h-16 w-16 text-green-600" />
									</div>
									<h1 className="text-2xl font-bold text-foreground">Email verified!</h1>
									<p className="text-muted-foreground">
										Your email address has been successfully verified.
										<br />
										Redirecting you to the dashboard...
									</p>
								</>
							)}

							{status === "error" && (
								<>
									<div className="flex justify-center">
										<XCircle className="h-16 w-16 text-destructive" />
									</div>
									<h1 className="text-2xl font-bold text-foreground">Verification failed</h1>
									<p className="text-muted-foreground">{errorMessage}</p>
									<div className="pt-4">
										<Button asChild>
											<Link href="/dash">Go to Dashboard</Link>
										</Button>
									</div>
								</>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
