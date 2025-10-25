"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
	children: string
	className?: string
	language?: string
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(children)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	// Extract language from className (format: language-xxx)
	const lang = language || className?.replace(/language-/, "") || "text"

	return (
		<div className="relative group my-6">
			<div className="absolute right-3 top-3 z-10">
				<Button
					size="sm"
					variant="secondary"
					onClick={handleCopy}
					className="h-7 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
				>
					{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
				</Button>
			</div>
			<pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto border border-border">
				<code className={className} style={{ background: "transparent" }}>
					{children}
				</code>
			</pre>
		</div>
	)
}
