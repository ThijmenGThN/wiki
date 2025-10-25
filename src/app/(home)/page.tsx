import { preloadedQueryResult, preloadQuery } from "convex/nextjs"
import { ArrowRight, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"
import { api } from "@/../convex/_generated/api"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentlyViewed } from "@/components/wiki/recently-viewed"

export default async function Page() {
	const categoriesQuery = await preloadQuery(api.wiki.getCategories)
	const recentPagesQuery = await preloadQuery(api.wiki.getRecentPages, { limit: 5 })
	const mostLikedPagesQuery = await preloadQuery(api.wiki.getMostLikedPages, { limit: 5 })

	const categories = preloadedQueryResult(categoriesQuery)
	const recentPages = preloadedQueryResult(recentPagesQuery)
	const mostLikedPages = preloadedQueryResult(mostLikedPagesQuery)

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
								<div key={category._id}>
									<Link href={`/${category.slug}`}>
										<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
											<CardHeader>
												<CardTitle className="flex items-center justify-between">
													{category.title}
													<ArrowRight className="h-5 w-5" />
												</CardTitle>
												<CardDescription className="line-clamp-2">
													{category.subtitle}
												</CardDescription>
											</CardHeader>
										</Card>
									</Link>
								</div>
							))
						)}
					</div>
				</div>

				{/* Recent Pages and Most Liked */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Recent Pages */}
					<div>
						<h2 className="text-2xl font-semibold mb-4">Recently Updated</h2>
						<div className="space-y-3">
							{recentPages.length === 0 ? (
								<p className="text-muted-foreground">No pages found.</p>
							) : (
								recentPages.map((page) => (
									<div key={page._id}>
										<Link href={`/${page.category?.slug}/${page.slug}`}>
											<Card className="hover:shadow-md transition-shadow p-4 cursor-pointer">
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1">
														<CardTitle className="text-lg">{page.title}</CardTitle>
														<CardDescription className="line-clamp-1">
															{page.subtitle}
														</CardDescription>
														<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
															<div className="flex items-center gap-1">
																<Heart className="h-3.5 w-3.5" />
																<span>{page.likeCount ?? 0}</span>
															</div>
															<div className="flex items-center gap-1">
																<MessageSquare className="h-3.5 w-3.5" />
																<span>{page.commentCount ?? 0}</span>
															</div>
														</div>
													</div>
													<span className="text-sm text-muted-foreground whitespace-nowrap">
														{page.category?.title}
													</span>
												</div>
											</Card>
										</Link>
									</div>
								))
							)}
						</div>
					</div>

					{/* Most Liked */}
					<div>
						<h2 className="text-2xl font-semibold mb-4">Most Liked</h2>
						<div className="space-y-3">
							{mostLikedPages.length === 0 ? (
								<p className="text-muted-foreground">No pages found.</p>
							) : (
								mostLikedPages.map((page) => (
									<div key={page._id}>
										<Link href={`/${page.category?.slug}/${page.slug}`}>
											<Card className="hover:shadow-md transition-shadow p-4 cursor-pointer">
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1">
														<CardTitle className="text-lg">{page.title}</CardTitle>
														<CardDescription className="line-clamp-1">
															{page.subtitle}
														</CardDescription>
														<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
															<div className="flex items-center gap-1">
																<Heart className="h-3.5 w-3.5" />
																<span>{page.likeCount ?? 0}</span>
															</div>
															<div className="flex items-center gap-1">
																<MessageSquare className="h-3.5 w-3.5" />
																<span>{page.commentCount ?? 0}</span>
															</div>
														</div>
													</div>
													<span className="text-sm text-muted-foreground whitespace-nowrap">
														{page.category?.title}
													</span>
												</div>
											</Card>
										</Link>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
