"use client"

import { useConvexAuth, useMutation } from "convex/react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"

interface ThemeToggleProps {
	size?: "default" | "sm" | "lg" | "icon"
}

export function ThemeToggle({ size = "icon" }: ThemeToggleProps) {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()
	const { isAuthenticated } = useConvexAuth()
	const updateTheme = useMutation(api.users.updateTheme)

	useEffect(() => {
		setMounted(true)
	}, [])

	const handleThemeChange = async (newTheme: "light" | "dark") => {
		setTheme(newTheme)
		// Only save to Convex if user is authenticated
		if (isAuthenticated) {
			try {
				await updateTheme({ theme: newTheme })
			} catch {
				// Silently fail if update fails
			}
		}
	}

	if (!mounted) {
		return (
			<Button variant="outline" size={size} className={size !== "icon" ? "px-3" : ""} disabled>
				<Moon className="h-4 w-4" />
			</Button>
		)
	}

	return (
		<Button
			variant="outline"
			size={size}
			onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
			className={size !== "icon" ? "px-3" : ""}
		>
			{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
		</Button>
	)
}
