"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
	size?: "default" | "sm" | "lg" | "icon"
	variant?: "toggle" | "cycle"
}

export function ThemeToggle({ size = "icon", variant = "toggle" }: ThemeToggleProps) {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()

	useEffect(() => {
		setMounted(true)
	}, [])

	const cycleTheme = () => {
		if (variant === "toggle") {
			setTheme(theme === "dark" ? "light" : "dark")
		} else {
			if (theme === "light") {
				setTheme("dark")
			} else if (theme === "dark") {
				setTheme("system")
			} else {
				setTheme("light")
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
			<Button
				variant="ghost"
				size={size}
				className="bg-popover hover:bg-popover/80 ring-1 ring-border"
				disabled
			>
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
