import { preloadedQueryResult, preloadQuery } from "convex/nextjs"
import { FileText, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { api } from "@/../convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
	const { category } = await params
	const dataQuery = await preloadQuery(api.wiki.getPagesByCategory, { categorySlug: category })
	const data = preloadedQueryResult(dataQuery)

	if (!data.category) {
		notFound()
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-7xl">
			<div className="space-y-6">
				{/* Breadcrumb Navigation */}
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/" className="hover:text-foreground transition-colors">
						Home
					</Link>
					<span>/</span>
					<span className="text-foreground">{data.category.title}</span>
				</div>

				{/* Category Header */}
				<div>
					<h1 className="text-4xl font-bold mb-2">{data.category.title}</h1>
					<p className="text-lg text-muted-foreground">{data.category.subtitle}</p>
				</div>

				{/* Pages List */}
				<div>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-semibold">Pages</h2>
						<Badge variant="secondary">{data.pages.length} pages</Badge>
					</div>

					{data.pages.length === 0 ? (
						<Card>
							<CardContent className="py-8 text-center text-muted-foreground">
								No pages in this category yet.
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{data.pages.map((page) => (
								<Link key={page._id} href={`/${category}/${page.slug}`}>
									<Card className="h-full hover:shadow-lg flex flex-col justify-between p-4 transition-shadow cursor-pointer">
										<div>
											<CardTitle className="flex items-center gap-2">
												<FileText className="h-5 w-5 flex-shrink-0" />
												<span className="line-clamp-2">{page.title}</span>
											</CardTitle>
											<CardDescription className="mt-3 line-clamp-3">
												{page.subtitle}
											</CardDescription>
										</div>
										<div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
											<div className="flex items-center gap-1">
												<Heart className="h-3.5 w-3.5" />
												<span>{page.likeCount ?? 0}</span>
											</div>
											<div className="flex items-center gap-1">
												<MessageSquare className="h-3.5 w-3.5" />
												<span>{page.commentCount ?? 0}</span>
											</div>
										</div>
									</Card>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
