"use client"

import { useQuery } from "convex/react"
import { Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/../convex/_generated/api"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { useDebounce } from "@/hooks/use-debounce"

export function WikiSearch() {
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)
	const router = useRouter()
	const debouncedSearch = useDebounce(searchTerm, 300)
	const searchResults = useQuery(
		api.wiki.searchPages,
		debouncedSearch.trim().length > 0 ? { searchTerm: debouncedSearch } : "skip",
	)

	// Debug logging
	useEffect(() => {
		if (debouncedSearch.trim().length > 0) {
			console.log("Search term:", debouncedSearch)
			console.log("Search results:", searchResults)
		}
	}, [debouncedSearch, searchResults])

	// Reset selected index when search results change
	useEffect(() => {
		setSelectedIndex(0)
	}, [searchResults])

	// Handle keyboard navigation and shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Handle "/" shortcut to focus search (only if not already focused)
			if (e.key === "/" && document.activeElement !== inputRef) {
				e.preventDefault()
				inputRef?.focus()
				return
			}

			if (!searchTerm || !searchResults || searchResults.length === 0) {
				if (e.key === "Escape") {
					setSearchTerm("")
					inputRef?.blur()
				}
				return
			}

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault()
					setSelectedIndex((prev) => (prev + 1) % searchResults.length)
					break
				case "ArrowUp":
					e.preventDefault()
					setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length)
					break
				case "Enter":
					e.preventDefault()
					if (searchResults[selectedIndex]) {
						const page = searchResults[selectedIndex]
						router.push(`/${page.category?.slug}/${page.slug}`)
						setSearchTerm("")
						inputRef?.blur()
					}
					break
				case "Escape":
					setSearchTerm("")
					inputRef?.blur()
					break
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [searchTerm, searchResults, selectedIndex, router, inputRef])

	return (
		<div className="relative w-full max-w-3xl">
			<Command className="rounded-lg border shadow-md bg-popover" shouldFilter={false}>
				<CommandInput
					ref={setInputRef}
					placeholder="Search wiki pages..."
					value={searchTerm}
					onValueChange={setSearchTerm}
				/>
				{searchTerm && (
					<CommandList className="absolute top-full left-0 right-0 mt-1 max-h-[400px] rounded-lg border shadow-lg bg-popover z-50">
						{searchResults === undefined ? (
							<div className="py-6 text-center text-sm">Searching...</div>
						) : searchResults && searchResults.length > 0 ? (
							<CommandGroup heading="Pages">
								{searchResults.map((page, index) => (
									<Link key={page._id} href={`/${page.category?.slug}/${page.slug}`}>
										<CommandItem
											className={`flex flex-col items-start gap-1 cursor-pointer ${index === selectedIndex ? "bg-accent" : ""}`}
											onMouseEnter={() => setSelectedIndex(index)}
										>
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
					</CommandList>
				)}
			</Command>
		</div>
	)
}
