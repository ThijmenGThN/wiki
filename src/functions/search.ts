"use server"

import { Page } from '@/payload-types'
import { getPayload } from './connector'

export async function searchContent(query: string): Promise<{
    pages: Page[]
    totalResults: number
}> {
    if (!query || query.trim().length === 0) {
        return { pages: [], totalResults: 0 }
    }

    const payload = await getPayload()

    const searchQuery = query.trim()

    const pages = await payload.find({
        collection: "pages",
        pagination: false,
        where: {
            or: [
                { title: { contains: searchQuery } },
                { subtitle: { contains: searchQuery } },
                { markdown: { contains: searchQuery } }
            ]
        }
    })

    return {
        pages: pages.docs as Page[],
        totalResults: pages.docs.length
    }
}

export async function getRecentPages(limit: number = 10): Promise<Page[]> {
    const payload = await getPayload()

    const pages = await payload.find({
        collection: "pages",
        limit,
        sort: '-createdAt'
    })

    return pages.docs as Page[]
}
