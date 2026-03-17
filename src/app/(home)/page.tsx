import { ArrowRight } from "lucide-react"
import Link from "next/link"
import {
	AffineUnavailableError,
	type WikiCategory,
	type WikiPageWithPreview,
	getCategories,
	getRecentPages,
} from "@/lib/affine"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MostViewed } from "@/components/wiki/most-viewed"
import { RecentlyViewed } from "@/components/wiki/recently-viewed"

export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function Page() {
	let categories: WikiCategory[] = []
	let recentPages: WikiPageWithPreview[] = []
	let unavailable = false

	try {
		;[categories, recentPages] = await Promise.all([getCategories(), getRecentPages(5)])
	} catch (err) {
		if (err instanceof AffineUnavailableError) {
			unavailable = true
		} else {
			throw err
		}
	}

	if (unavailable) {
		return (
			<div className="container mx-auto py-16 px-4 max-w-7xl text-center">
				<h1 className="text-2xl font-bold mb-2">Wiki temporarily unavailable</h1>
				<p className="text-muted-foreground">
					The content server is not responding. Try refreshing the page or check back later.
				</p>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-7xl">
			<div className="space-y-8">
				{/* Recently Viewed */}
				<RecentlyViewed />

				{/* Categories */}
				<div>
					<h2 className="text-2xl font-semibold mb-4">Categories</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{categories.length === 0 ? (
							<p className="text-muted-foreground">No categories found.</p>
						) : (
							categories.map((category) => (
								<div key={category.slug}>
									<Link href={`/${category.slug}`}>
										<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
											<CardHeader>
												<CardTitle className="flex items-center justify-between">
													{category.title}
													<ArrowRight className="h-5 w-5" />
												</CardTitle>
												<CardDescription className="line-clamp-2">
													{category.pageCount} {category.pageCount === 1 ? "page" : "pages"}
												</CardDescription>
											</CardHeader>
										</Card>
									</Link>
								</div>
							))
						)}
					</div>
				</div>

				{/* Recent Pages and Most Viewed */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Recent Pages */}
					<div>
						<h2 className="text-2xl font-semibold mb-4">Recently Updated</h2>
						<div className="space-y-3">
							{recentPages.length === 0 ? (
								<p className="text-muted-foreground">No pages found.</p>
							) : (
								recentPages.map((page) => (
									<div key={page.id}>
										<Link href={`/${page.categorySlug}/${page.slug}`}>
											<Card className="hover:shadow-md transition-shadow p-4 cursor-pointer overflow-hidden gap-0">
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1">
														<CardTitle className="text-lg">{page.title}</CardTitle>
													</div>
													<span className="text-sm text-muted-foreground whitespace-nowrap">
														{page.categoryTitle}
													</span>
												</div>
												{page.preview && (
													<div className="relative mt-0.5 max-h-16 overflow-hidden">
														<p className="text-sm text-muted-foreground leading-snug">
															{page.preview}
														</p>
														<div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
													</div>
												)}
											</Card>
										</Link>
									</div>
								))
							)}
						</div>
					</div>

					{/* Most Viewed */}
					<MostViewed />
				</div>
			</div>
		</div>
	)
}
