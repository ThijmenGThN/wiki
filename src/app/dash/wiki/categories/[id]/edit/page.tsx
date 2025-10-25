"use client"

import { use, useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import type { Id } from "@/../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params)
	const router = useRouter()
	const category = useQuery(api.admin.getCategoryById, { id: id as Id<"categories"> })
	const updateCategory = useMutation(api.admin.updateCategory)

	const [formData, setFormData] = useState({
		slug: "",
		title: "",
		subtitle: "",
	})

	useEffect(() => {
		if (category) {
			setFormData({
				slug: category.slug,
				title: category.title,
				subtitle: category.subtitle,
			})
		}
	}, [category])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.slug || !formData.title || !formData.subtitle) {
			toast.error("All fields are required")
			return
		}

		try {
			await updateCategory({
				id: id as Id<"categories">,
				...formData,
			})
			toast.success("Category updated successfully")
			router.push("/dash/wiki")
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to update category")
		}
	}

	const generateSlug = () => {
		const slug = formData.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
		setFormData({ ...formData, slug })
	}

	if (category === undefined) {
		return (
			<div className="container mx-auto py-8 px-4">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		)
	}

	if (!category) {
		return (
			<div className="container mx-auto py-8 px-4">
				<p className="text-muted-foreground">Category not found</p>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-3xl">
			<Link href="/dash/wiki">
				<Button variant="ghost" size="sm" className="gap-2 mb-6">
					<ArrowLeft className="h-4 w-4" />
					Back to Wiki Management
				</Button>
			</Link>

			<Card>
				<CardHeader>
					<CardTitle>Edit Category</CardTitle>
					<CardDescription>Update category information</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								placeholder="e.g., Docker"
								required
							/>
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
								placeholder="e.g., docker"
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
								placeholder="Brief description of the category..."
								rows={3}
								required
							/>
						</div>

						<div className="flex gap-3 justify-end">
							<Link href="/dash/wiki">
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</Link>
							<Button type="submit">Update Category</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
