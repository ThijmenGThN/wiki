"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useQuery } from "convex/react"
import { LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { api } from "@/../convex/_generated/api"
import LogoBlack from "@/assets/logo.black.png"
import LogoWhite from "@/assets/logo.white.png"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { WikiSearch } from "@/components/wiki/wiki-search"

export function WikiHeader() {
	const user = useQuery(api.users.current)
	const { signOut } = useAuthActions()
	const { theme, resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Determine which logo to show based on theme
	const logoSrc = mounted && (resolvedTheme === "dark" || theme === "dark") ? LogoWhite : LogoBlack

	return (
		<header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			{/* Main navbar */}
			<div className="container mx-auto h-24 px-4 py-4 flex items-center justify-between relative">
				{/* Left - Logo */}
				<Link href="/" className="inline-block hover:opacity-80 transition-opacity">
					<Image src={logoSrc} alt="Wiki Logo" className="h-10 w-auto" priority />
				</Link>

				{/* Center/Right - Wiki title and subtitle */}
				<Link
					href="/"
					className="flex flex-col items-end md:items-center md:absolute md:left-1/2 md:-translate-x-1/2 hover:opacity-80 transition-opacity"
				>
					<h1 className="text-3xl font-bold">Wiki</h1>
					<p className="text-sm text-muted-foreground hidden md:block">
						Browse through our comprehensive knowledge base
					</p>
				</Link>
			</div>

			{/* Sub-bar with search and user info */}
			<div className="border-t border-border bg-muted/30">
				<div className="container mx-auto px-4 py-3 flex items-center justify-center gap-2">
					{/* Theme switcher */}
					<ThemeToggle variant="cycle" size="sm" />

					{/* Search */}
					<WikiSearch />

					{/* Logout button */}
					{user && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => void signOut()}
							className="bg-popover hover:bg-popover/80 ring-1 ring-border"
						>
							<LogOut className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</header>
	)
}
