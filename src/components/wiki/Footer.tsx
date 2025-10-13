"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function Footer() {
	const settings = useQuery(api.wiki.getSettings)

	return (
		<p className="my-16 mx-auto text-xs text-center w-3/4 sm:w-1/2">
			{settings?.disclaimer || ""}
		</p>
	)
}
