"use client"

import { useQuery } from "convex/react"
import { Search as SearchIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"

export default function Search() {
	const [searchTerm, setSearchTerm] = useState("")
	const results = useQuery(api.wiki.searchPages, { searchTerm }) || []

	return (
		<div className="flex flex-col gap-y-4 mt-8 mx-8 sm:mx-16 md:mx-32">
			<div className="relative rounded-md shadow-sm">
				<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<SearchIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
				</div>
				<input
					className="block w-full rounded-md border-0 py-3 pl-11 text-gray-900 bg-white ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700"
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search"
					type="text"
				/>
				<div
					className={cn(
						"flex flex-col gap-y-4 absolute w-full bg-white dark:bg-gray-800 p-8 pt-4 mt-2 ring-1 shadow-sm ring-inset ring-gray-300 dark:ring-gray-700 rounded-md",
						results.length === 0 ? "hidden" : "",
					)}
				>
					<p className="font-semibold">Results</p>
					<ul className="grid gap-4 md:grid-cols-2">
						{results.map((result) => (
							<li key={result._id}>
								<Link
									className="flex flex-col gap-y-2 rounded bg-gradient-to-tr from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border p-4 shadow-sm hover:cursor-pointer hover:to-gray-100 dark:hover:to-gray-700"
									href={`/${result.category?.slug}/${result.slug}`}
								>
									<p>{result.title}</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">{result.subtitle}</p>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}
