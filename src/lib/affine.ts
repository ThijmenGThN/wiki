import { unstable_cache } from "next/cache"
import { getBlocksuiteReader } from "affine-reader"

const AFFINE_BASE_URL = process.env.AFFINE_BASE_URL || "http://10.0.0.133"
const AFFINE_EMAIL = process.env.AFFINE_EMAIL || ""
const AFFINE_PASSWORD = process.env.AFFINE_PASSWORD || ""
const AFFINE_WORKSPACE_ID = process.env.AFFINE_WORKSPACE_ID || ""

// Session token is the only in-memory state — just an auth optimization
let cachedSessionToken: string | null = null
let tokenExpiry = 0

async function getSessionToken(retries = 3): Promise<string> {
	if (cachedSessionToken && Date.now() < tokenExpiry) {
		return cachedSessionToken
	}

	let lastError: Error | null = null

	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			const res = await fetch(`${AFFINE_BASE_URL}/api/auth/sign-in`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: AFFINE_EMAIL, password: AFFINE_PASSWORD }),
			})

			if (!res.ok) {
				throw new Error(`AFFiNE auth failed: ${res.status} ${res.statusText}`)
			}

			// Extract session token from set-cookie header
			const cookies = res.headers.getSetCookie?.() ?? []
			const sessionCookie = cookies
				.find((c) => c.startsWith("affine_session="))
				?.split("=")[1]
				?.split(";")[0]

			if (sessionCookie) {
				cachedSessionToken = sessionCookie
			} else {
				// Fallback: try JSON response for token
				const data = await res.json()
				cachedSessionToken = data.token || data.sessionToken || null
			}

			if (!cachedSessionToken) {
				throw new Error("Failed to extract session token from AFFiNE auth response")
			}

			// Cache for 50 minutes (AFFiNE sessions typically last 1 hour)
			tokenExpiry = Date.now() + 50 * 60 * 1000
			return cachedSessionToken
		} catch (err) {
			lastError = err instanceof Error ? err : new Error(String(err))
			if (attempt < retries - 1) {
				await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
			}
		}
	}

	throw lastError!
}

function createReader(sessionToken: string) {
	return getBlocksuiteReader({
		workspaceId: AFFINE_WORKSPACE_ID,
		target: AFFINE_BASE_URL,
		sessionToken,
		parser: {
			buildBlobUrl: (blobId: string) =>
				`${AFFINE_BASE_URL}/api/workspaces/${AFFINE_WORKSPACE_ID}/blobs/${blobId}`,
			buildDocUrl: (docId: string) => `/page/${docId}`,
		},
	})
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_]+/g, "-")
		.replace(/^-+|-+$/g, "")
}

export interface WikiCategory {
	slug: string
	title: string
	pageCount: number
}

export interface WikiPageMeta {
	id: string
	slug: string
	title: string
	categorySlug: string
	categoryTitle: string
	createdAt: number
}

export interface WikiPage extends WikiPageMeta {
	markdown: string
}

export interface WikiPageWithPreview extends WikiPageMeta {
	preview: string
}

export class AffineUnavailableError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "AffineUnavailableError"
	}
}

export function extractPreview(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, "") // remove code blocks
		.replace(/^#{1,6}\s+/gm, "") // remove heading markers
		.replace(/[*_~`[\]()>|\\-]/g, "") // remove markdown syntax
		.replace(/\n+/g, " ") // collapse newlines
		.trim()
		.slice(0, 200)
}

// Cached data fetchers — Next.js manages the cache (file-based, survives restarts)
const fetchPageMetas = unstable_cache(
	async (): Promise<{ categories: WikiCategory[]; pages: WikiPageMeta[] }> => {
		const sessionToken = await getSessionToken()
		const reader = createReader(sessionToken)
		const metas = await reader.getDocPageMetas()

		if (!metas) return { categories: [], pages: [] }

		const categoryMap = new Map<string, { title: string; count: number }>()
		const pages: WikiPageMeta[] = []

		for (const meta of metas) {
			if (meta.trash) continue
			const tags: string[] = meta.properties?.tags ?? []
			if (tags.length === 0) continue

			const categoryTitle = tags[0]
			const categorySlug = slugify(categoryTitle)

			if (!categoryMap.has(categorySlug)) {
				categoryMap.set(categorySlug, { title: categoryTitle, count: 0 })
			}
			categoryMap.get(categorySlug)!.count++

			pages.push({
				id: meta.id,
				slug: slugify(meta.title),
				title: meta.title,
				categorySlug,
				categoryTitle,
				createdAt: meta.createDate,
			})
		}

		const categories = Array.from(categoryMap.entries())
			.map(([slug, { title, count }]) => ({ slug, title, pageCount: count }))
			.sort((a, b) => a.title.localeCompare(b.title))

		pages.sort((a, b) => b.createdAt - a.createdAt)

		return { categories, pages }
	},
	["affine-page-metas"],
	{ revalidate: 60 },
)

const fetchPageMarkdown = unstable_cache(
	async (pageId: string): Promise<string> => {
		const sessionToken = await getSessionToken()
		const reader = createReader(sessionToken)
		const doc = await reader.getDocMarkdown(pageId)
		return doc?.md || ""
	},
	["affine-page-markdown"],
	{ revalidate: 60 },
)

// Public API — consumers don't need to change
export async function getCategories(): Promise<WikiCategory[]> {
	try {
		const { categories } = await fetchPageMetas()
		return categories
	} catch (err) {
		throw new AffineUnavailableError(
			err instanceof Error ? err.message : "Failed to connect to AFFiNE",
		)
	}
}

export async function getCategoryBySlug(
	slug: string,
): Promise<{ category: WikiCategory; pages: WikiPageWithPreview[] } | null> {
	try {
		const { categories, pages } = await fetchPageMetas()
		const category = categories.find((c) => c.slug === slug)
		if (!category) return null

		const categoryPages = pages.filter((p) => p.categorySlug === slug)
		const pagesWithPreviews = await Promise.all(
			categoryPages.map(async (page) => {
				const markdown = await fetchPageMarkdown(page.id)
				return { ...page, preview: extractPreview(markdown) }
			}),
		)

		return { category, pages: pagesWithPreviews }
	} catch (err) {
		throw new AffineUnavailableError(
			err instanceof Error ? err.message : "Failed to connect to AFFiNE",
		)
	}
}

export async function getPageBySlug(
	categorySlug: string,
	pageSlug: string,
): Promise<WikiPage | null> {
	try {
		const { pages } = await fetchPageMetas()
		const pageMeta = pages.find((p) => p.categorySlug === categorySlug && p.slug === pageSlug)
		if (!pageMeta) return null

		const markdown = await fetchPageMarkdown(pageMeta.id)
		return { ...pageMeta, markdown }
	} catch (err) {
		throw new AffineUnavailableError(
			err instanceof Error ? err.message : "Failed to fetch page content",
		)
	}
}

export async function getRecentPages(limit = 5): Promise<WikiPageWithPreview[]> {
	try {
		const { pages } = await fetchPageMetas()
		const recent = pages.slice(0, limit)

		return await Promise.all(
			recent.map(async (page) => {
				const markdown = await fetchPageMarkdown(page.id)
				return { ...page, preview: extractPreview(markdown) }
			}),
		)
	} catch (err) {
		throw new AffineUnavailableError(
			err instanceof Error ? err.message : "Failed to connect to AFFiNE",
		)
	}
}

export async function searchPages(query: string): Promise<WikiPageMeta[]> {
	try {
		const { pages } = await fetchPageMetas()
		const q = query.toLowerCase()
		return pages.filter(
			(p) => p.title.toLowerCase().includes(q) || p.categoryTitle.toLowerCase().includes(q),
		)
	} catch (err) {
		throw new AffineUnavailableError(
			err instanceof Error ? err.message : "Failed to connect to AFFiNE",
		)
	}
}
