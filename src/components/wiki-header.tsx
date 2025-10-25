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
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		setMounted(true)
	}, [])

	// Handle scroll behavior
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY

			// Show navbar only when at absolute top (0px), hide otherwise
			if (currentScrollY === 0) {
				setIsVisible(true)
			} else {
				setIsVisible(false)
			}
		}

		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	// Determine which logo to show based on theme
	const logoSrc = mounted && (resolvedTheme === "dark" || theme === "dark") ? LogoWhite : LogoBlack

	return (
		<header className={`border-b border-border bg-muted/30 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
			<div className="container mx-auto px-4">
				{/* First Row - Logo and Controls (always visible) */}
				<div className="py-3 grid grid-cols-2 md:grid-cols-3 items-center gap-4">
					{/* Left - Logo */}
					<div className="flex items-center">
						<Link href="/" className="inline-block hover:opacity-80 transition-opacity">
							<Image src={logoSrc} alt="Wiki Logo" className="h-8 w-auto" priority />
						</Link>
					</div>

					{/* Center - Search (desktop only) */}
					<div className="hidden md:flex items-center justify-center">
						<WikiSearch />
					</div>

					{/* Right - Controls */}
					<div className="flex items-center justify-end gap-2">
						<ThemeToggle variant="cycle" size="sm" />
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

				{/* Second Row - Search Bar (mobile only) */}
				<div className="md:hidden pb-3 pt-0">
					<WikiSearch />
				</div>
			</div>
		</header>
	)
}
