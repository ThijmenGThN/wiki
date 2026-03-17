import Link from "next/link"
import { notFound } from "next/navigation"
import { AffineUnavailableError, getPageBySlug, extractPreview } from "@/lib/affine"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MarkdownRenderer } from "@/components/wiki/markdown-renderer"
import { PageViewTracker } from "@/components/wiki/page-view-tracker"
import { ViewTracker } from "@/components/wiki/view-tracker"
import { ViewCount } from "@/components/wiki/view-count"

export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function WikiPageDetail({
	params,
}: {
	params: Promise<{ category: string; slug: string }>
}) {
	const { category, slug } = await params

	let page: Awaited<ReturnType<typeof getPageBySlug>>
	try {
		page = await getPageBySlug(category, slug)
	} catch (err) {
		if (err instanceof AffineUnavailableError) {
			return (
				<div className="container mx-auto py-16 px-4 max-w-4xl text-center">
					<h1 className="text-2xl font-bold mb-2">Wiki temporarily unavailable</h1>
					<p className="text-muted-foreground">
						The content server is not responding. Try refreshing the page or check back later.
					</p>
				</div>
			)
		}
		throw err
	}

	if (!page) {
		notFound()
	}

	const pageKey = `${category}/${slug}`
	const preview = extractPreview(page.markdown)

	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<PageViewTracker
				pageId={page.id}
				categorySlug={category}
				pageSlug={slug}
				title={page.title}
				categoryTitle={page.categoryTitle}
				preview={preview}
			/>
			<ViewTracker pageKey={pageKey} title={page.title} preview={preview} />
			<div className="space-y-6">
				{/* Breadcrumb Navigation */}
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/" className="hover:text-foreground transition-colors">
						Home
					</Link>
					<span>/</span>
					<Link href={`/${category}`} className="hover:text-foreground transition-colors">
						{page.categoryTitle}
					</Link>
					<span>/</span>
					<span className="text-foreground">{page.title}</span>
				</div>

				{/* Page Header */}
				<div className="space-y-3">
					<Link href={`/${category}`}>
						<Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
							{page.categoryTitle}
						</Badge>
					</Link>
					<h1 className="text-4xl font-bold mt-3">{page.title}</h1>
					<ViewCount pageKey={pageKey} />
				</div>

				<Separator />

				{/* Page Content */}
				<div className="prose-wrapper">
					<MarkdownRenderer content={page.markdown} />
				</div>
			</div>
		</div>
	)
}
