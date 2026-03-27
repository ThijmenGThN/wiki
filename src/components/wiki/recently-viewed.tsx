"use client"

import { Clock } from "lucide-react"
import Link from "next/link"
import { Card, CardTitle } from "@/components/ui/card"
import { HoverCard } from "@/components/ui/hover-card-motion"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

export function RecentlyViewed() {
	const { recentlyViewed } = useRecentlyViewed()

	if (recentlyViewed.length === 0) {
		return null
	}

	return (
		<div>
			<h2 className="text-2xl font-semibold mb-4">Recently Viewed</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
				{recentlyViewed.map((page) => (
					<HoverCard key={page.pageId}>
						<Link href={`/${page.categorySlug}/${page.pageSlug}`}>
							<Card className="relative h-full hover:shadow-lg p-4 transition-shadow cursor-pointer overflow-hidden gap-0">
								<div className="flex items-start gap-2">
									<Clock className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
									<div className="flex-1 min-w-0">
										<CardTitle className="text-base line-clamp-2">{page.title}</CardTitle>
									</div>
								</div>
								{page.preview && (
									<div className="mt-0.5 flex-1 overflow-hidden">
										<p className="text-xs text-muted-foreground leading-snug">{page.preview}</p>
									</div>
								)}
								<div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
							</Card>
						</Link>
					</HoverCard>
				))}
			</div>
		</div>
	)
}
