"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import type { Id } from "@/../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { AuthDialog } from "@/components/auth-dialog"

interface CommentSectionProps {
	pageId: Id<"pages">
}

export function CommentSection({ pageId }: CommentSectionProps) {
	const [commentContent, setCommentContent] = useState("")
	const [showAuthDialog, setShowAuthDialog] = useState(false)
	const comments = useQuery(api.wiki.getComments, { pageId })
	const currentUser = useQuery(api.users.current)
	const addComment = useMutation(api.wiki.addComment)
	const deleteComment = useMutation(api.wiki.deleteComment)

	const handleSubmitComment = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!commentContent.trim()) return

		if (!currentUser) {
			setShowAuthDialog(true)
			return
		}

		try {
			await addComment({ pageId, content: commentContent })
			setCommentContent("")
			toast.success("Comment added")
		} catch (error) {
			toast.error("Failed to add comment")
		}
	}

	const handleDeleteComment = async (commentId: Id<"comments">) => {
		try {
			await deleteComment({ commentId })
			toast.success("Comment deleted")
		} catch (error) {
			toast.error("Failed to delete comment")
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-xl font-semibold mb-4">Comments</h3>

				<form onSubmit={handleSubmitComment} className="space-y-3 mb-6">
					<Textarea
						value={commentContent}
						onChange={(e) => setCommentContent(e.target.value)}
						placeholder={currentUser ? "Write a comment..." : "Write a comment... (login required to post)"}
						rows={3}
						className="bg-popover"
					/>
					<Button type="submit" disabled={!commentContent.trim()}>
						Post Comment
					</Button>
				</form>
			</div>

			<div className="space-y-4">
				{comments === undefined ? (
					<p className="text-sm text-muted-foreground">Loading comments...</p>
				) : comments.length === 0 ? (
					<p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
				) : (
					comments.map((comment) => (
						<Card key={comment._id} className="p-4">
							<div className="flex gap-3">
								<Avatar className="h-10 w-10">
									<AvatarImage src={comment.user?.image} />
									<AvatarFallback>
										{comment.user?.name?.[0]?.toUpperCase() ?? "U"}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 space-y-2">
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium">{comment.user?.name ?? "Anonymous"}</p>
											<p className="text-xs text-muted-foreground">
												{formatDistanceToNow(new Date(comment._creationTime), { addSuffix: true })}
											</p>
										</div>
										{(currentUser?._id === comment.userId || currentUser?.isAdmin) && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDeleteComment(comment._id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										)}
									</div>
									<p className="text-sm whitespace-pre-wrap">{comment.content}</p>
								</div>
							</div>
						</Card>
					))
				)}
			</div>

			<AuthDialog
				open={showAuthDialog}
				onOpenChange={setShowAuthDialog}
				message="You need to be logged in to post comments."
			/>
		</div>
	)
}
