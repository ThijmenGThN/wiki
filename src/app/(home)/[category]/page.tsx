import { FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { HoverCard } from "@/components/ui/hover-card-motion"
import { AffineUnavailableError, getCategoryBySlug } from "@/lib/affine"

export const revalidate = 60

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
	const { category } = await params

	let data: Awaited<ReturnType<typeof getCategoryBySlug>>
	try {
		data = await getCategoryBySlug(category)
	} catch (err) {
		if (err instanceof AffineUnavailableError) {
			return (
				<div className="container mx-auto py-16 px-4 max-w-7xl text-center">
					<h1 className="text-2xl font-bold mb-2">Wiki temporarily unavailable</h1>
					<p className="text-muted-foreground">
						The content server is not responding. Try refreshing the page or check back later.
					</p>
				</div>
			)
		}
		throw err
	}

	if (!data) {
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
								<HoverCard key={page.id}>
									<Link href={`/${category}/${page.slug}`}>
										<Card className="relative h-full hover:shadow-lg flex flex-col p-4 transition-shadow cursor-pointer overflow-hidden gap-0">
											<CardTitle className="flex items-center gap-2">
												<FileText className="h-5 w-5 flex-shrink-0" />
												<span className="line-clamp-2">{page.title}</span>
											</CardTitle>
											{page.preview && (
												<div className="mt-0.5 max-h-20 overflow-hidden">
													<p className="text-sm text-muted-foreground leading-snug">
														{page.preview}
													</p>
												</div>
											)}
											<div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent" />
										</Card>
									</Link>
								</HoverCard>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
