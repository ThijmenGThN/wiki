"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Id } from "@/../convex/_generated/dataModel"

export default function AdminWikiPage() {
	const categories = useQuery(api.wiki.getCategories)
	const pages = useQuery(api.admin.getAllPages)
	const deleteCategory = useMutation(api.admin.deleteCategory)
	const deletePage = useMutation(api.admin.deletePage)

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<{
		type: "category" | "page"
		id: Id<"categories"> | Id<"pages">
		name: string
	} | null>(null)

	const handleDeleteCategory = (id: Id<"categories">, name: string) => {
		setItemToDelete({ type: "category", id: id as Id<"categories">, name })
		setDeleteDialogOpen(true)
	}

	const handleDeletePage = (id: Id<"pages">, name: string) => {
		setItemToDelete({ type: "page", id: id as Id<"pages">, name })
		setDeleteDialogOpen(true)
	}

	const confirmDelete = async () => {
		if (!itemToDelete) return

		try {
			if (itemToDelete.type === "category") {
				await deleteCategory({ id: itemToDelete.id as Id<"categories"> })
				toast.success("Category deleted")
			} else {
				await deletePage({ id: itemToDelete.id as Id<"pages"> })
				toast.success("Page deleted")
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to delete")
		} finally {
			setDeleteDialogOpen(false)
			setItemToDelete(null)
		}
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-7xl">
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Wiki Management</h1>
						<p className="text-muted-foreground">Manage categories and pages</p>
					</div>
					<Link href="/wiki" target="_blank">
						<Button variant="outline" className="gap-2">
							<ExternalLink className="h-4 w-4" />
							View Wiki
						</Button>
					</Link>
				</div>

				<Tabs defaultValue="pages" className="w-full">
					<TabsList>
						<TabsTrigger value="pages">Pages</TabsTrigger>
						<TabsTrigger value="categories">Categories</TabsTrigger>
					</TabsList>

					<TabsContent value="pages" className="space-y-4">
						<div className="flex justify-between items-center">
							<p className="text-sm text-muted-foreground">
								{pages?.length ?? 0} total pages
							</p>
							<Link href="/dash/wiki/pages/new">
								<Button className="gap-2">
									<Plus className="h-4 w-4" />
									New Page
								</Button>
							</Link>
						</div>

						<Card>
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Title</TableHead>
											<TableHead>Category</TableHead>
											<TableHead>Slug</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{pages === undefined ? (
											<TableRow>
												<TableCell colSpan={4} className="text-center text-muted-foreground">
													Loading...
												</TableCell>
											</TableRow>
										) : pages.length === 0 ? (
											<TableRow>
												<TableCell colSpan={4} className="text-center text-muted-foreground">
													No pages yet
												</TableCell>
											</TableRow>
										) : (
											pages.map((page) => (
												<TableRow key={page._id}>
													<TableCell className="font-medium">{page.title}</TableCell>
													<TableCell>
														<Badge variant="secondary">{page.category?.title}</Badge>
													</TableCell>
													<TableCell className="font-mono text-sm">{page.slug}</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Link href={`/dash/wiki/pages/${page._id}/edit`}>
																<Button variant="ghost" size="sm">
																	<Pencil className="h-4 w-4" />
																</Button>
															</Link>
															<Button
																variant="ghost"
																size="sm"
																onClick={() => handleDeletePage(page._id, page.title)}
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="categories" className="space-y-4">
						<div className="flex justify-between items-center">
							<p className="text-sm text-muted-foreground">
								{categories?.length ?? 0} total categories
							</p>
							<Link href="/dash/wiki/categories/new">
								<Button className="gap-2">
									<Plus className="h-4 w-4" />
									New Category
								</Button>
							</Link>
						</div>

						<Card>
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Title</TableHead>
											<TableHead>Slug</TableHead>
											<TableHead>Subtitle</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{categories === undefined ? (
											<TableRow>
												<TableCell colSpan={4} className="text-center text-muted-foreground">
													Loading...
												</TableCell>
											</TableRow>
										) : categories.length === 0 ? (
											<TableRow>
												<TableCell colSpan={4} className="text-center text-muted-foreground">
													No categories yet
												</TableCell>
											</TableRow>
										) : (
											categories.map((category) => (
												<TableRow key={category._id}>
													<TableCell className="font-medium">{category.title}</TableCell>
													<TableCell className="font-mono text-sm">{category.slug}</TableCell>
													<TableCell className="max-w-md truncate">
														{category.subtitle}
													</TableCell>
													<TableCell className="text-right">
														<div className="flex justify-end gap-2">
															<Link href={`/dash/wiki/categories/${category._id}/edit`}>
																<Button variant="ghost" size="sm">
																	<Pencil className="h-4 w-4" />
																</Button>
															</Link>
															<Button
																variant="ghost"
																size="sm"
																onClick={() =>
																	handleDeleteCategory(category._id, category.title)
																}
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete &quot;{itemToDelete?.name}&quot;.
							{itemToDelete?.type === "page" &&
								" All associated comments and likes will also be deleted."}
							{itemToDelete?.type === "category" &&
								" Make sure all pages are deleted from this category first."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
