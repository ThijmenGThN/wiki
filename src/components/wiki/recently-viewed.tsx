"use client"

import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import Link from "next/link"

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
					<Link key={page.pageId} href={`/${page.categorySlug}/${page.pageSlug}`}>
						<Card className="h-full hover:shadow-lg p-4 transition-shadow cursor-pointer">
							<div className="flex items-start gap-2">
								<Clock className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
								<div className="flex-1 min-w-0">
									<CardTitle className="text-base line-clamp-2">{page.title}</CardTitle>
									<CardDescription className="line-clamp-2 text-sm mt-1">
										{page.subtitle}
									</CardDescription>
								</div>
							</div>
						</Card>
					</Link>
				))}
			</div>
		</div>
	)
}
