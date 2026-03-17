"use client"

import { useEffect } from "react"

interface ViewTrackerProps {
	pageKey: string
	title: string
	preview: string
}

export function ViewTracker({ pageKey, title, preview }: ViewTrackerProps) {
	useEffect(() => {
		fetch("/api/views", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ page: pageKey, title, preview }),
		}).catch(() => {})
	}, [pageKey, title, preview])

	return null
}
