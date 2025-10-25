"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import type { Id } from "@/../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { AuthDialog } from "@/components/auth-dialog"

interface LikeButtonProps {
	pageId: Id<"pages">
}

export function LikeButton({ pageId }: LikeButtonProps) {
	const [showAuthDialog, setShowAuthDialog] = useState(false)
	const likeCount = useQuery(api.wiki.getLikeCount, { pageId })
	const hasLiked = useQuery(api.wiki.hasUserLikedPage, { pageId })
	const currentUser = useQuery(api.users.current)
	const toggleLike = useMutation(api.wiki.toggleLike)

	const handleToggleLike = async () => {
		if (!currentUser) {
			setShowAuthDialog(true)
			return
		}

		try {
			await toggleLike({ pageId })
		} catch (error) {
			toast.error("Failed to update like")
		}
	}

	return (
		<>
			<Button
				variant={hasLiked ? "default" : "outline"}
				size="sm"
				onClick={handleToggleLike}
				className="gap-2"
			>
				<Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
				<span>{likeCount ?? 0}</span>
			</Button>

			<AuthDialog
				open={showAuthDialog}
				onOpenChange={setShowAuthDialog}
				message="You need to be logged in to like pages."
			/>
		</>
	)
}
