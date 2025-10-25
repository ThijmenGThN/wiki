"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NewCategoryPage() {
	const router = useRouter()
	const createCategory = useMutation(api.admin.createCategory)

	const [formData, setFormData] = useState({
		slug: "",
		title: "",
		subtitle: "",
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.slug || !formData.title || !formData.subtitle) {
			toast.error("All fields are required")
			return
		}

		try {
			await createCategory(formData)
			toast.success("Category created successfully")
			router.push("/dash/wiki")
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to create category")
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
		<div className="container mx-auto py-8 px-4 max-w-3xl">
			<Link href="/dash/wiki">
				<Button variant="ghost" size="sm" className="gap-2 mb-6">
					<ArrowLeft className="h-4 w-4" />
					Back to Wiki Management
				</Button>
			</Link>

			<Card>
				<CardHeader>
					<CardTitle>Create New Category</CardTitle>
					<CardDescription>Add a new category to organize your wiki pages</CardDescription>
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
							<Button type="submit">Create Category</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
