import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard } from "@/components/ui/hover-card-motion"
import { MostViewed } from "@/components/wiki/most-viewed"
import { RecentlyViewed } from "@/components/wiki/recently-viewed"
import {
	AffineUnavailableError,
	getCategories,
	getRecentPages,
	type WikiCategory,
	type WikiPageWithPreview,
} from "@/lib/affine"

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
								<HoverCard key={category.slug}>
									<Link href={`/${category.slug}`}>
										<Card className="group relative h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
											<CardHeader>
												<CardTitle className="flex items-center justify-between">
													{category.title}
													<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
												</CardTitle>
												<CardDescription className="line-clamp-2">
													{category.pageCount} {category.pageCount === 1 ? "page" : "pages"}
												</CardDescription>
											</CardHeader>
											<svg
												className="absolute -bottom-1 -right-1 h-16 w-48 text-muted-foreground/10 transition-transform duration-300 origin-bottom-right group-hover:rotate-3"
												aria-hidden="true"
											>
												<pattern
													id={`logo-${category.slug}`}
													x="0"
													y="0"
													width="44"
													height="30"
													patternUnits="userSpaceOnUse"
												>
													<g fill="currentColor" transform="scale(0.13)">
														<path d="M193.417 138.64C192.22 138.64 191.25 137.669 191.25 136.472L191.25 2.43215C191.25 1.23516 192.22 0.264807 193.417 0.264807L245.333 0.264809C246.53 0.264809 247.5 1.23516 247.5 2.43216L247.5 136.472C247.5 137.669 246.53 138.64 245.333 138.64L193.417 138.64Z" />
														<path d="M140.824 138.64C139.627 138.64 138.659 137.669 138.628 136.473C138.36 126.217 136.192 116.083 132.218 106.576C127.964 96.3987 121.72 87.1284 113.823 79.3032C105.926 71.4772 96.5314 65.2503 86.1663 60.9956C76.4671 57.0143 66.1056 54.8369 55.6046 54.5733C54.408 54.5432 53.4374 53.5757 53.4374 52.3787V2.15094C53.4374 0.953943 54.408 -0.0181522 55.6048 0.000257236C73.2049 0.270974 90.6044 3.83701 106.885 10.52C123.835 17.4774 139.244 27.6785 152.23 40.5473C165.216 53.4165 175.525 68.7019 182.56 85.5341C189.317 101.699 192.926 118.983 193.202 136.472C193.22 137.669 192.248 138.64 191.051 138.64H140.824Z" />
														<path d="M53.4375 136.472C53.4375 137.669 52.4671 138.64 51.2702 138.64H2.16735C0.970353 138.64 0 137.669 0 136.472V56.4322C0 55.2352 0.970354 54.2648 2.16735 54.2648H51.2702C52.4671 54.2648 53.4375 55.2352 53.4375 56.4322V136.472Z" />
													</g>
												</pattern>
												<rect width="100%" height="100%" fill={`url(#logo-${category.slug})`} />
											</svg>
										</Card>
									</Link>
								</HoverCard>
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
									<HoverCard key={page.id}>
										<Link href={`/${page.categorySlug}/${page.slug}`}>
											<Card className="relative hover:shadow-md transition-shadow p-4 cursor-pointer overflow-hidden gap-0">
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1">
														<CardTitle className="text-lg">{page.title}</CardTitle>
													</div>
													<span className="text-sm text-muted-foreground whitespace-nowrap">
														{page.categoryTitle}
													</span>
												</div>
												{page.preview && (
													<div className="mt-0.5 max-h-16 overflow-hidden">
														<p className="text-sm text-muted-foreground leading-snug">
															{page.preview}
														</p>
													</div>
												)}
												<div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
											</Card>
										</Link>
									</HoverCard>
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
