import Link from "next/link"
import { preloadedQueryResult } from "convex/nextjs"
import { preloadQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArrowLeft } from "lucide-react"

import Search from "@/components/wiki/Search"
import Header from "@/components/wiki/Header"
import Toolbar from "@/components/wiki/Toolbar"

export default async function Page({
	params,
}: {
	params: Promise<{ page: string; category: string }>
}) {
	const { page: pageSlug } = await params

	const preloadedPageData = await preloadQuery(api.wiki.getPageBySlug, { slug: pageSlug })
	const pageData = preloadedQueryResult(preloadedPageData)

	const preloadedSettings = await preloadQuery(api.wiki.getSettings)
	const settings = preloadedQueryResult(preloadedSettings)

	return (
		<>
			<Header breadcrumb={pageData?.title} settings={settings} />

			<Search />

			<Toolbar />

			<div className="flex flex-col gap-y-6 mt-16 mx-8 sm:mx-16">
				<div className="flex flex-col gap-y-4 mx-8">
					<p className="text-sm">{pageData?.subtitle}</p>
				</div>

				<div className="rounded border shadow-sm p-8 bg-gradient-to-tr from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
					<div className="prose dark:prose-invert min-w-full">
						<Markdown remarkPlugins={[remarkGfm]}>{pageData?.markdown}</Markdown>
					</div>
				</div>

				<div className="mx-auto mt-16">
					<Link href={`/${pageData?.category?.slug || ""}`}>
						<button
							type="button"
							className="bg-black dark:bg-white rounded-full p-3 text-white dark:text-black items-center hover:scale-105 transition-transform duration-200"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
					</Link>
				</div>
			</div>
		</>
	)
}
