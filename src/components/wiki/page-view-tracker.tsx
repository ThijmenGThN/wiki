"use client"

import { useEffect } from "react"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

interface PageViewTrackerProps {
	pageId: string
	categorySlug: string
	pageSlug: string
	title: string
	subtitle: string
	categoryTitle: string
}

export function PageViewTracker({
	pageId,
	categorySlug,
	pageSlug,
	title,
	subtitle,
	categoryTitle,
}: PageViewTrackerProps) {
	const { addRecentlyViewed } = useRecentlyViewed()

	useEffect(() => {
		addRecentlyViewed({
			pageId,
			categorySlug,
			pageSlug,
			title,
			subtitle,
			categoryTitle,
		})
	}, [pageId, categorySlug, pageSlug, title, subtitle, categoryTitle, addRecentlyViewed])

	return null
}
