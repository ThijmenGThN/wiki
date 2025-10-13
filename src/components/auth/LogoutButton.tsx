"use client"

import { useAuthActions } from "@convex-dev/auth/react"

export default function LogoutButton() {
	const { signOut } = useAuthActions()
	return (
		<button type="button" onClick={() => void signOut()}>
			Logout
		</button>
	)
}
