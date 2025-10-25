"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function UnauthorizedPage() {
	const { signOut } = useAuthActions()
	const router = useRouter()

	const handleSignOut = async () => {
		await signOut()
		router.push("/login")
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="max-w-md w-full">
				<CardContent className="pt-6">
					<div className="space-y-6 text-center">
						<div className="flex justify-center">
							<div className="rounded-full bg-destructive/10 p-3">
								<ShieldAlert className="h-10 w-10 text-destructive" />
							</div>
						</div>

						<div className="space-y-2">
							<h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
							<p className="text-muted-foreground">
								You do not have permission to access the admin dashboard. This area is restricted to
								administrators only.
							</p>
						</div>

						<div className="pt-4 space-y-2">
							<Button asChild className="w-full">
								<Link href="/">Return to Home</Link>
							</Button>
							<Button variant="outline" className="w-full" onClick={handleSignOut}>
								Sign Out
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
