import { preloadedQueryResult, preloadQuery } from "convex/nextjs"
import Link from "next/link"
import Header from "@/components/wiki/Header"

import Search from "@/components/wiki/Search"
import Toolbar from "@/components/wiki/Toolbar"
import { api } from "@/convex/_generated/api"

export default async function Page() {
	const preloadedCategories = await preloadQuery(api.wiki.listCategories)
	const categories = preloadedQueryResult(preloadedCategories)

	const preloadedSettings = await preloadQuery(api.wiki.getSettings)
	const settings = preloadedQueryResult(preloadedSettings)

	return (
		<>
			<Header settings={settings} />

			<Search />

			<Toolbar />

			<div className="flex flex-col gap-y-4 mt-16 mx-8 sm:mx-16">
				<b>Explore</b>
				<ul className="grid gap-4 md:grid-cols-2">
					{categories.map((category) => (
						<li key={category._id}>
							<Link
								className="flex flex-col gap-y-2 rounded bg-gradient-to-tr from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border p-4 shadow-sm hover:cursor-pointer hover:to-gray-100 dark:hover:to-gray-700"
								href={`/${category.slug}`}
							>
								<p>{category.title}</p>
								<p className="text-xs text-gray-600 dark:text-gray-400">{category.subtitle}</p>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</>
	)
}
