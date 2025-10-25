import { preloadedQueryResult, preloadQuery } from "convex/nextjs"
import { api } from "@/../convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MarkdownRenderer } from "@/components/wiki/markdown-renderer"
import { LikeButton } from "@/components/wiki/like-button"
import { CommentSection } from "@/components/wiki/comment-section"
import { PageViewTracker } from "@/components/wiki/page-view-tracker"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function WikiPageDetail({
	params,
}: {
	params: Promise<{ category: string; slug: string }>
}) {
	const { category, slug } = await params
	const pageQuery = await preloadQuery(api.wiki.getPageBySlug, {
		categorySlug: category,
		pageSlug: slug,
	})
	const page = preloadedQueryResult(pageQuery)

	if (!page) {
		notFound()
	}

	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<PageViewTracker
				pageId={page._id}
				categorySlug={category}
				pageSlug={slug}
				title={page.title}
				subtitle={page.subtitle}
				categoryTitle={page.category?.title ?? ""}
			/>
			<div className="space-y-6">
				{/* Breadcrumb Navigation */}
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/" className="hover:text-foreground transition-colors">
						Home
					</Link>
					<span>/</span>
					<Link href={`/${category}`} className="hover:text-foreground transition-colors">
						{page.category?.title}
					</Link>
					<span>/</span>
					<span className="text-foreground">{page.title}</span>
				</div>

				{/* Page Header */}
				<div className="space-y-3">
					<Link href={`/${category}`}>
						<Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
							{page.category?.title}
						</Badge>
					</Link>
					<h1 className="text-4xl font-bold mt-3">{page.title}</h1>
					<p className="text-lg text-muted-foreground">{page.subtitle}</p>

					{/* Like Button */}
					<div className="flex items-center gap-3 pt-2">
						<LikeButton pageId={page._id} />
					</div>
				</div>

				<Separator />

				{/* Page Content */}
				<div className="prose-wrapper">
					<MarkdownRenderer content={page.markdown} />
				</div>

				<Separator />

				{/* Comments */}
				<CommentSection pageId={page._id} />
			</div>
		</div>
	)
}
