import { preloadedQueryResult, preloadQuery } from "convex/nextjs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/wiki/Header"

import Search from "@/components/wiki/Search"
import Toolbar from "@/components/wiki/Toolbar"
import { api } from "@/convex/_generated/api"

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
	const { category: categorySlug } = await params

	const preloadedPages = await preloadQuery(api.wiki.listPagesByCategory, { categorySlug })
	const pages = preloadedQueryResult(preloadedPages)

	const preloadedCategory = await preloadQuery(api.wiki.getCategoryBySlug, { slug: categorySlug })
	const category = preloadedQueryResult(preloadedCategory)

	const preloadedSettings = await preloadQuery(api.wiki.getSettings)
	const settings = preloadedQueryResult(preloadedSettings)

	return (
		<>
			<Header breadcrumb={category?.title || categorySlug} settings={settings} />

			<Search />

			<Toolbar />

			<div className="flex flex-col gap-y-4 mt-16 mx-8 sm:mx-16">
				<b>Explore</b>
				<ul className="grid gap-4 md:grid-cols-2">
					{pages.map((page) => (
						<li key={page._id}>
							<Link
								className="flex flex-col gap-y-2 rounded bg-gradient-to-tr from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border p-4 shadow-sm hover:cursor-pointer hover:to-gray-100 dark:hover:to-gray-700"
								href={`/${categorySlug}/${page.slug}`}
							>
								<p>{page.title}</p>
								<p className="text-xs text-gray-600 dark:text-gray-400">{page.subtitle}</p>
							</Link>
						</li>
					))}
				</ul>

				<div className="mx-auto mt-16">
					<Link href="/">
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
