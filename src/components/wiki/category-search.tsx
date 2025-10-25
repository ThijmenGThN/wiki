"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Heart, MessageSquare, FileText } from "lucide-react"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"

interface CategorySearchProps {
	categorySlug: string
}

export function CategorySearch({ categorySlug }: CategorySearchProps) {
	const [searchTerm, setSearchTerm] = useState("")
	const debouncedSearchTerm = useDebounce(searchTerm, 300)

	const searchResults = useQuery(
		api.wiki.searchPagesByCategory,
		debouncedSearchTerm.trim().length > 0
			? { categorySlug, searchTerm: debouncedSearchTerm }
			: "skip"
	)

	const hasResults = searchResults && searchResults.length > 0
	const isSearching = searchTerm.trim().length > 0

	return (
		<div className="space-y-4">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search pages in this category..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-9 bg-popover"
				/>
			</div>

			{isSearching && (
				<div className="space-y-4">
					{hasResults ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{searchResults.map((page) => (
								<Link key={page._id} href={`/${categorySlug}/${page.slug}`}>
									<Card className="h-full hover:shadow-lg flex flex-col justify-between p-4 transition-shadow cursor-pointer">
										<div>
											<CardTitle className="flex items-center gap-2">
												<FileText className="h-5 w-5 flex-shrink-0" />
												<span className="line-clamp-2">{page.title}</span>
											</CardTitle>
											<CardDescription className="mt-3 line-clamp-3">
												{page.subtitle}
											</CardDescription>
										</div>
										<div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
											<div className="flex items-center gap-1">
												<Heart className="h-3.5 w-3.5" />
												<span>{page.likeCount ?? 0}</span>
											</div>
											<div className="flex items-center gap-1">
												<MessageSquare className="h-3.5 w-3.5" />
												<span>{page.commentCount ?? 0}</span>
											</div>
										</div>
									</Card>
								</Link>
							))}
						</div>
					) : (
						<Card>
							<div className="py-8 text-center text-muted-foreground">
								No pages found matching "{searchTerm}"
							</div>
						</Card>
					)}
				</div>
			)}
		</div>
	)
}
