import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "wiki_recently_viewed"
const MAX_ITEMS = 5

export interface RecentlyViewedPage {
	pageId: string
	categorySlug: string
	pageSlug: string
	title: string
	categoryTitle: string
	preview: string
	viewedAt: number
}

export function useRecentlyViewed() {
	const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedPage[]>([])

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored) {
			try {
				const parsed = JSON.parse(stored) as RecentlyViewedPage[]
				setRecentlyViewed(parsed)
			} catch (e) {
				console.error("Failed to parse recently viewed pages:", e)
				localStorage.removeItem(STORAGE_KEY)
			}
		}
	}, [])

	const addRecentlyViewed = useCallback((page: Omit<RecentlyViewedPage, "viewedAt">) => {
		setRecentlyViewed((prev) => {
			const filtered = prev.filter((p) => p.pageId !== page.pageId)
			const updated = [{ ...page, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
			return updated
		})
	}, [])

	const clearRecentlyViewed = useCallback(() => {
		setRecentlyViewed([])
		localStorage.removeItem(STORAGE_KEY)
	}, [])

	return {
		recentlyViewed,
		addRecentlyViewed,
		clearRecentlyViewed,
	}
}
