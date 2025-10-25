"use client"

import { LogIn, Palette, UserPlus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
	const [step, setStep] = useState(0)

	useEffect(() => {
		// Show "Hello" for 1500ms
		const timer1 = setTimeout(() => setStep(1), 1500)
		// Show description after fade out (1500ms + 500ms transition)
		const timer2 = setTimeout(() => setStep(2), 2500)
		// Show card after description appears (2500ms + 2500ms)
		const timer3 = setTimeout(() => setStep(3), 5000)

		return () => {
			clearTimeout(timer1)
			clearTimeout(timer2)
			clearTimeout(timer3)
		}
	}, [])

	return (
		<div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
			{/* "Hello" animation */}
			<div
				className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${step >= 1
						? "opacity-0 -translate-y-8 pointer-events-none"
						: "opacity-100 translate-y-0"
					}`}
			>
				<h1 className="text-5xl font-bold text-foreground">Hello</h1>
			</div>

			{/* Description text */}
			<div
				className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${step >= 2 && step < 3
						? "opacity-100 translate-y-0"
						: step < 2
							? "opacity-0 translate-y-8 pointer-events-none"
							: "opacity-0 -translate-y-4 pointer-events-none"
					}`}
			>
				<div className="px-6 text-center space-y-2">
					<p className="text-xl font-bold text-foreground">Welcome to next-leaflet</p>
					<p className="text-lg text-muted-foreground">
						Get started by logging in or creating an account
					</p>
				</div>
			</div>

			{/* Main card */}
			<div
				className={`w-full max-w-md px-6 transition-all duration-500 ${step >= 3
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8 pointer-events-none"
					}`}
			>
				<Card>
					<CardContent>
						<div className="text-center space-y-6">
							<div className="space-y-3">
								<Button asChild size="lg" className="w-full">
									<Link href="/login">
										<LogIn className="h-4 w-4 mr-2" />
										Login
									</Link>
								</Button>
								<div className="flex gap-2">
									<Button asChild variant="outline" size="lg" className="flex-1">
										<Link href="/register">
											<UserPlus className="h-4 w-4 mr-2" />
											Register
										</Link>
									</Button>
									<div className="shrink-0">
										<ThemeToggle size="lg" />
									</div>
								</div>
							</div>

							<div className="pt-2 border-t border-border">
								<Button asChild variant="ghost" size="sm" className="w-full">
									<Link href="/ui">
										<Palette className="h-4 w-4 mr-2" />
										View UI Components
									</Link>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
