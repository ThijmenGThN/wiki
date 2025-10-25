"use client"

import { useMutation, useQuery } from "convex/react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/../convex/_generated/api"
import type { Id } from "@/../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownRenderer } from "@/components/wiki/markdown-renderer"

export default function NewPagePage() {
	const router = useRouter()
	const categories = useQuery(api.wiki.getCategories)
	const createPage = useMutation(api.admin.createPage)

	const [formData, setFormData] = useState({
		slug: "",
		title: "",
		subtitle: "",
		categoryId: "" as Id<"categories"> | "",
		markdown: "",
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (
			!formData.slug ||
			!formData.title ||
			!formData.subtitle ||
			!formData.categoryId ||
			!formData.markdown
		) {
			toast.error("All fields are required")
			return
		}

		try {
			await createPage({
				...formData,
				categoryId: formData.categoryId as Id<"categories">,
			})
			toast.success("Page created successfully")
			router.push("/dash/wiki")
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to create page")
		}
	}

	const generateSlug = () => {
		const slug = formData.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
		setFormData({ ...formData, slug })
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-7xl">
			<Link href="/dash/wiki">
				<Button variant="ghost" size="sm" className="gap-2 mb-6">
					<ArrowLeft className="h-4 w-4" />
					Back to Wiki Management
				</Button>
			</Link>

			<Card>
				<CardHeader>
					<CardTitle>Create New Page</CardTitle>
					<CardDescription>Add a new page to your wiki</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) => setFormData({ ...formData, title: e.target.value })}
									placeholder="e.g., Installing Docker"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">Category</Label>
								<Select
									value={formData.categoryId}
									onValueChange={(value) =>
										setFormData({ ...formData, categoryId: value as Id<"categories"> })
									}
									required
								>
									<SelectTrigger id="category">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories?.map((category) => (
											<SelectItem key={category._id} value={category._id}>
												{category.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="slug">Slug</Label>
								<Button type="button" variant="ghost" size="sm" onClick={generateSlug}>
									Generate from title
								</Button>
							</div>
							<Input
								id="slug"
								value={formData.slug}
								onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
								placeholder="e.g., installing-docker"
								required
								pattern="[a-z0-9-]+"
								title="Only lowercase letters, numbers, and hyphens"
							/>
							<p className="text-sm text-muted-foreground">
								URL-friendly version (lowercase, hyphens only)
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subtitle">Subtitle</Label>
							<Textarea
								id="subtitle"
								value={formData.subtitle}
								onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
								placeholder="Brief description of the page..."
								rows={2}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="markdown">Content (Markdown)</Label>
							<Tabs defaultValue="edit" className="w-full">
								<TabsList>
									<TabsTrigger value="edit">Edit</TabsTrigger>
									<TabsTrigger value="preview">Preview</TabsTrigger>
								</TabsList>
								<TabsContent value="edit" className="mt-3">
									<Textarea
										id="markdown"
										value={formData.markdown}
										onChange={(e) => setFormData({ ...formData, markdown: e.target.value })}
										placeholder="Write your content in markdown..."
										rows={20}
										className="font-mono"
										required
									/>
								</TabsContent>
								<TabsContent value="preview" className="mt-3">
									<div className="border rounded-md p-4 min-h-[500px]">
										{formData.markdown ? (
											<MarkdownRenderer content={formData.markdown} />
										) : (
											<p className="text-muted-foreground">Nothing to preview yet...</p>
										)}
									</div>
								</TabsContent>
							</Tabs>
						</div>

						<div className="flex gap-3 justify-end">
							<Link href="/dash/wiki">
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</Link>
							<Button type="submit">Create Page</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
