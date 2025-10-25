"use client"

import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "./code-block"
import { ExternalLink, Link as LinkIcon } from "lucide-react"
import "highlight.js/styles/github.css"

interface MarkdownRendererProps {
	content: string
	className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
	return (
		<div
			className={`markdown-content ${className}`}
			style={{
				lineHeight: "1.7",
				fontSize: "16px",
			}}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw, rehypeHighlight]}
				components={{
					// Headers
					h1: ({ children }) => (
						<h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b">{children}</h1>
					),
					h2: ({ children }) => (
						<h2 className="text-2xl font-bold mt-6 mb-3 pb-2 border-b">{children}</h2>
					),
					h3: ({ children }) => (
						<h3 className="text-xl font-semibold mt-6 mb-2">{children}</h3>
					),
					h4: ({ children }) => (
						<h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>
					),
					h5: ({ children }) => (
						<h5 className="text-base font-semibold mt-4 mb-2">{children}</h5>
					),
					h6: ({ children }) => (
						<h6 className="text-sm font-semibold mt-4 mb-2">{children}</h6>
					),

					// Paragraphs
					p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,

					// Lists
					ul: ({ children }) => (
						<ul className="list-disc list-inside mb-4 space-y-2 ml-4">{children}</ul>
					),
					ol: ({ children }) => (
						<ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>
					),
					li: ({ children }) => <li className="leading-7">{children}</li>,

					// Code blocks
					pre: ({ children }) => {
						// Extract code element and its props
						const codeElement = children as any
						const codeProps = codeElement?.props || {}
						const className = codeProps.className || ""
						const codeContent = String(codeProps.children || "").replace(/\n$/, "")

						return (
							<div className="mb-4">
								<CodeBlock className={className} language={className?.replace(/language-/, "")}>
									{codeContent}
								</CodeBlock>
							</div>
						)
					},
					code: ({ className, children, ...props }) => {
						const match = /language-(\w+)/.exec(className || "")
						const isInline = !match

						if (isInline) {
							return (
								<code
									className="bg-muted px-2 py-0.5 rounded text-sm font-mono border border-border"
									{...props}
								>
									{children}
								</code>
							)
						}

						// This handles the code inside pre, which is handled by the pre component
						return (
							<code className={`${className} text-sm font-mono`} {...props}>
								{children}
							</code>
						)
					},

					// Links
					a: ({ children, href }) => {
						const isExternal = href?.startsWith("http")
						return (
							<a
								href={href}
								target={isExternal ? "_blank" : undefined}
								rel={isExternal ? "noopener noreferrer" : undefined}
								className="text-primary hover:underline font-medium inline-flex items-center gap-1"
							>
								{isExternal ? (
									<ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
								) : (
									<LinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
								)}
								{children}
							</a>
						)
					},

					// Blockquotes
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 italic text-muted-foreground bg-muted/30 rounded-r">
							{children}
						</blockquote>
					),

					// Tables
					table: ({ children }) => (
						<div className="overflow-x-auto mb-4">
							<table className="min-w-full border-collapse border border-border">
								{children}
							</table>
						</div>
					),
					thead: ({ children }) => (
						<thead className="bg-muted">{children}</thead>
					),
					tbody: ({ children }) => <tbody>{children}</tbody>,
					tr: ({ children }) => (
						<tr className="border-b border-border">{children}</tr>
					),
					th: ({ children }) => (
						<th className="border border-border px-4 py-2 text-left font-semibold">
							{children}
						</th>
					),
					td: ({ children }) => (
						<td className="border border-border px-4 py-2">{children}</td>
					),

					// Horizontal rule
					hr: () => <hr className="my-8 border-border" />,

					// Strong and emphasis
					strong: ({ children }) => (
						<strong className="font-bold text-foreground">{children}</strong>
					),
					em: ({ children }) => <em className="italic">{children}</em>,
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	)
}
