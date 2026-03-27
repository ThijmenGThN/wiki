"use client"

import { motion } from "motion/react"
import type { ComponentProps } from "react"

export function HoverCard({ children, className, ...props }: ComponentProps<typeof motion.div>) {
	return (
		<motion.div
			whileHover={{ y: -2, scale: 1.01 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	)
}
