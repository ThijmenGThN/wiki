import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "wiki_recently_viewed"
const MAX_ITEMS = 5

export interface RecentlyViewedPage {
	pageId: string
	categorySlug: string
	pageSlug: string
	title: string
	subtitle: string
	categoryTitle: string
	viewedAt: number
}

export function useRecentlyViewed() {
	const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedPage[]>([])

	useEffect(() => {
		// Load from localStorage on mount
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
			// Remove existing entry for this page if it exists
			const filtered = prev.filter((p) => p.pageId !== page.pageId)

			// Add new entry at the beginning
			const updated = [{ ...page, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS)

			// Save to localStorage
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
