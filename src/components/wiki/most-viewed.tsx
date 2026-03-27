"use client"

import { Eye } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardTitle } from "@/components/ui/card"
import { HoverCard } from "@/components/ui/hover-card-motion"

interface MostViewedPage {
	pageKey: string
	title: string
	preview: string
	count: number
}

export function MostViewed() {
	const [pages, setPages] = useState<MostViewedPage[]>([])

	useEffect(() => {
		fetch("/api/views?top=5")
			.then((res) => res.json())
			.then((data) => setPages(data))
			.catch(() => {})
	}, [])

	if (pages.length === 0) {
		return null
	}

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4">Most Viewed</h2>
			<div className="space-y-3">
				{pages.map((page) => (
					<HoverCard key={page.pageKey}>
						<Link href={`/${page.pageKey}`}>
							<Card className="relative hover:shadow-md transition-shadow p-4 cursor-pointer overflow-hidden gap-0">
								<div className="flex items-center justify-between gap-4">
									<CardTitle className="text-lg">{page.title}</CardTitle>
									<div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
										<Eye className="h-3.5 w-3.5" />
										<span>{page.count}</span>
									</div>
								</div>
								{page.preview && (
									<div className="mt-0.5 max-h-16 overflow-hidden">
										<p className="text-sm text-muted-foreground leading-snug">{page.preview}</p>
									</div>
								)}
								<div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
							</Card>
						</Link>
					</HoverCard>
				))}
			</div>
		</div>
	)
}
