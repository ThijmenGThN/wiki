"use client"

import { Eye } from "lucide-react"
import { useEffect, useState } from "react"

interface ViewCountProps {
	pageKey: string
}

export function ViewCount({ pageKey }: ViewCountProps) {
	const [count, setCount] = useState<number | null>(null)

	useEffect(() => {
		fetch(`/api/views?page=${encodeURIComponent(pageKey)}`)
			.then((res) => res.json())
			.then((data) => setCount(data.count))
			.catch(() => {})
	}, [pageKey])

	if (count === null) return null

	return (
		<div className="flex items-center gap-1 text-sm text-muted-foreground">
			<Eye className="h-3.5 w-3.5" />
			<span>{count}</span>
		</div>
	)
}
