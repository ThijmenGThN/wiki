"use client"

import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import Link from "next/link"
import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { WikiSearch } from "@/components/wiki/wiki-search"

export function WikiHeader() {
	const user = useQuery(api.users.current)
	const { signOut } = useAuthActions()

	return (
		<header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
			{/* Main navbar */}
			<div className="container mx-auto px-4 py-4 flex items-center justify-center">
				{/* Center - Wiki title and subtitle */}
				<Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
					<h1 className="text-xl font-bold">Wiki</h1>
					<p className="text-sm text-muted-foreground">
						Browse through our comprehensive knowledge base
					</p>
				</Link>
			</div>

			{/* Sub-bar with search and user info */}
			<div className="border-t border-border bg-muted/30">
				<div className="container mx-auto px-4 py-3 flex items-center justify-center gap-2">
					{/* Search */}
					<WikiSearch />

					{/* Logout button */}
					{user && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => void signOut()}
							className="gap-2 bg-popover hover:bg-popover/80"
						>
							<LogOut className="h-4 w-4" />
							Logout
						</Button>
					)}
				</div>
			</div>
		</header>
	)
}
