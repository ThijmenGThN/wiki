"use server"

import { Page } from '@/types/payload-types'
import { getPayload } from './connector'

export async function getPages(): Promise<Page[]> {
    const payload = await getPayload()

    const pages = await payload.find({
        collection: "pages",
        pagination: false
    })

    return pages.docs as Page[]
}

export async function getPagesByCategory(categorySlug: string): Promise<Page[]> {
    const payload = await getPayload()

    const pages = await payload.find({
        collection: "pages",
        pagination: false,
        where: { "category.slug": { equals: categorySlug } }
    })

    return pages.docs as Page[]
}

export async function getPageBySlug(pageSlug: string): Promise<Page | null> {
    const payload = await getPayload()

    const page = await payload.find({
        collection: "pages",
        limit: 1,
        where: { slug: { equals: pageSlug } }
    })

    return page.docs[0] as Page || null
}

export async function searchPages(query: string): Promise<Page[]> {
    const payload = await getPayload()

    const pages = await payload.find({
        collection: "pages",
        pagination: false,
        where: {
            or: [
                { title: { contains: query } },
                { subtitle: { contains: query } },
                { markdown: { contains: query } }
            ]
        }
    })

    return pages.docs as Page[]
}
