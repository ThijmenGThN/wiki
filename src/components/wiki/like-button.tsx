"use client"

import { useMutation, useQuery } from "convex/react"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/../convex/_generated/api"
import type { Id } from "@/../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { getSessionId } from "@/lib/session"

interface LikeButtonProps {
	pageId: Id<"pages">
}

export function LikeButton({ pageId }: LikeButtonProps) {
	const [sessionId, setSessionId] = useState<string>("")
	const likeCount = useQuery(api.wiki.getLikeCount, { pageId })
	const hasLiked = useQuery(api.wiki.hasUserLikedPage, { pageId, sessionId: sessionId || undefined })
	const toggleLike = useMutation(api.wiki.toggleLike)

	// Get session ID on mount (client-side only)
	useEffect(() => {
		setSessionId(getSessionId())
	}, [])

	const handleToggleLike = async () => {
		try {
			await toggleLike({ pageId, sessionId: sessionId || undefined })
		} catch (error) {
			toast.error("Failed to update like")
		}
	}

	return (
		<Button
			variant={hasLiked ? "default" : "outline"}
			size="sm"
			onClick={handleToggleLike}
			className="gap-2"
		>
			<Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
			<span>{likeCount ?? 0}</span>
		</Button>
	)
}
