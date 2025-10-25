"use client"

import { useQuery } from "convex/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/../convex/_generated/api"
import type { Id } from "@/../convex/_generated/dataModel"

interface ProfilePictureProps {
	user: {
		name?: string
		image?: string
		profilePictureStorageId?: Id<"_storage">
	} | null
	size?: "sm" | "md" | "lg" | "xl"
	className?: string
}

const sizeClasses = {
	sm: "size-8",
	md: "size-12",
	lg: "size-16",
	xl: "size-24",
}

const textSizeClasses = {
	sm: "text-xs",
	md: "text-sm",
	lg: "text-lg",
	xl: "text-2xl",
}

export function ProfilePicture({ user, size = "md", className }: ProfilePictureProps) {
	const uploadedPictureUrl = useQuery(
		api.users.getProfilePictureUrl,
		user?.profilePictureStorageId ? { storageId: user.profilePictureStorageId } : "skip",
	)

	const getInitials = (name?: string) => {
		if (!name) return "?"
		const parts = name.trim().split(" ")
		if (parts.length === 1) {
			return parts[0].substring(0, 2).toUpperCase()
		}
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
	}

	// Priority: uploaded picture > OAuth image > initials
	const imageUrl = uploadedPictureUrl || user?.image
	const initials = getInitials(user?.name)

	return (
		<Avatar className={`${sizeClasses[size]} ${className}`}>
			{imageUrl && <AvatarImage src={imageUrl} alt={user?.name || "Profile"} />}
			<AvatarFallback className={textSizeClasses[size]}>{initials}</AvatarFallback>
		</Avatar>
	)
}
