"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { useDebounce } from "@/hooks/use-debounce"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Search } from "lucide-react"
import Link from "next/link"

export function WikiSearch() {
	const [searchTerm, setSearchTerm] = useState("")
	const debouncedSearch = useDebounce(searchTerm, 300)
	const searchResults = useQuery(
		api.wiki.searchPages,
		debouncedSearch.trim().length > 0 ? { searchTerm: debouncedSearch } : "skip"
	)

	// Debug logging
	useEffect(() => {
		if (debouncedSearch.trim().length > 0) {
			console.log("Search term:", debouncedSearch)
			console.log("Search results:", searchResults)
		}
	}, [debouncedSearch, searchResults])

	// Handle escape key to clear search
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setSearchTerm("")
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [])

	return (
		<div className="relative w-full max-w-2xl">
			<Command className="rounded-lg border shadow-md" shouldFilter={false}>
				<CommandInput
					placeholder="Search wiki pages..."
					value={searchTerm}
					onValueChange={setSearchTerm}
				/>
				<CommandList>
					{searchTerm && (
						<>
							{searchResults === undefined ? (
								<div className="py-6 text-center text-sm">Searching...</div>
							) : searchResults && searchResults.length > 0 ? (
								<CommandGroup heading="Pages">
									{searchResults.map((page) => (
										<Link key={page._id} href={`/${page.category?.slug}/${page.slug}`}>
											<CommandItem className="flex flex-col items-start gap-1 cursor-pointer">
												<div className="flex items-center gap-2">
													<Search className="h-4 w-4" />
													<span className="font-medium">{page.title}</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<span>{page.category?.title}</span>
													<span>•</span>
													<span className="line-clamp-1">{page.subtitle}</span>
												</div>
											</CommandItem>
										</Link>
									))}
								</CommandGroup>
							) : (
								<CommandEmpty>No pages found.</CommandEmpty>
							)}
						</>
					)}
				</CommandList>
			</Command>
		</div>
	)
}
