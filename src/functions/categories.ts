"use server"

import { Category } from '@/types/payload-types'
import { getPayload } from './connector'

export async function getCategories(): Promise<Category[]> {
    const payload = await getPayload()

    const categories = await payload.find({
        collection: "categories",
        pagination: false
    })

    return categories.docs as Category[]
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const payload = await getPayload()

    const category = await payload.find({
        collection: "categories",
        limit: 1,
        where: { slug: { equals: slug } }
    })

    return category.docs[0] as Category || null
}

export async function getCategoryById(id: number): Promise<Category | null> {
    const payload = await getPayload()

    try {
        const category = await payload.findByID({
            collection: "categories",
            id
        })

        return category as Category
    } catch {
        return null
    }
}
