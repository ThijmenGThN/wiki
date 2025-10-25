"use client"

import { useConvexAuth, useMutation } from "convex/react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"

interface ThemeToggleProps {
	size?: "default" | "sm" | "lg" | "icon"
	variant?: "toggle" | "cycle" // toggle: light/dark only, cycle: light/dark/system
}

export function ThemeToggle({ size = "icon", variant = "toggle" }: ThemeToggleProps) {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()
	const { isAuthenticated } = useConvexAuth()
	const updateTheme = useMutation(api.users.updateTheme)

	useEffect(() => {
		setMounted(true)
	}, [])

	const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
		setTheme(newTheme)
		// Only save to Convex if user is authenticated
		if (isAuthenticated && newTheme !== "system") {
			try {
				await updateTheme({ theme: newTheme })
			} catch {
				// Silently fail if update fails
			}
		}
	}

	const cycleTheme = () => {
		if (variant === "toggle") {
			handleThemeChange(theme === "dark" ? "light" : "dark")
		} else {
			// Cycle through light -> dark -> system -> light
			if (theme === "light") {
				handleThemeChange("dark")
			} else if (theme === "dark") {
				handleThemeChange("system")
			} else {
				handleThemeChange("light")
			}
		}
	}

	const getIcon = () => {
		if (theme === "dark") return <Moon className="h-4 w-4" />
		if (theme === "light") return <Sun className="h-4 w-4" />
		return <Monitor className="h-4 w-4" />
	}

	if (!mounted) {
		return (
			<Button variant="ghost" size={size} className="bg-popover hover:bg-popover/80 ring-1 ring-border" disabled>
				<Moon className="h-4 w-4" />
			</Button>
		)
	}

	return (
		<Button
			variant="ghost"
			size={size}
			onClick={cycleTheme}
			className="bg-popover hover:bg-popover/80 ring-1 ring-border"
		>
			{getIcon()}
		</Button>
	)
}
