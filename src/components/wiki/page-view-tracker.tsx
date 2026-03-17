"use client"

import { useEffect } from "react"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

interface PageViewTrackerProps {
	pageId: string
	categorySlug: string
	pageSlug: string
	title: string
	categoryTitle: string
	preview: string
}

export function PageViewTracker({
	pageId,
	categorySlug,
	pageSlug,
	title,
	categoryTitle,
	preview,
}: PageViewTrackerProps) {
	const { addRecentlyViewed } = useRecentlyViewed()

	useEffect(() => {
		addRecentlyViewed({
			pageId,
			categorySlug,
			pageSlug,
			title,
			categoryTitle,
			preview,
		})
	}, [pageId, categorySlug, pageSlug, title, categoryTitle, preview, addRecentlyViewed])

	return null
}
