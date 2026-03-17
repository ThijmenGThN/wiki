import { getBlocksuiteReader } from "affine-reader"

const AFFINE_BASE_URL = process.env.AFFINE_BASE_URL || "http://10.0.0.133"
const AFFINE_EMAIL = process.env.AFFINE_EMAIL || ""
const AFFINE_PASSWORD = process.env.AFFINE_PASSWORD || ""
const AFFINE_WORKSPACE_ID = process.env.AFFINE_WORKSPACE_ID || ""

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

// In-memory cache for page data
interface CachedData {
	categories: WikiCategory[]
	pages: WikiPageMeta[]
	timestamp: number
}

let cache: CachedData | null = null
const CACHE_TTL = 60 * 1000 // 60 seconds

export class AffineUnavailableError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "AffineUnavailableError"
	}
}

async function fetchAllPages(): Promise<{ categories: WikiCategory[]; pages: WikiPageMeta[] }> {
	if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
		return { categories: cache.categories, pages: cache.pages }
	}

	try {
		const sessionToken = await getSessionToken()
		const reader = createReader(sessionToken)

		const pageMetas = await reader.getDocPageMetas()
		if (!pageMetas) {
			return { categories: [], pages: [] }
		}

		const categoryMap = new Map<string, { title: string; count: number }>()
		const pages: WikiPageMeta[] = []

		for (const meta of pageMetas) {
			if (meta.trash) continue

			const tags: string[] = meta.properties?.tags ?? []
			if (tags.length === 0) continue

			// Use the first tag as the category
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

		const categories: WikiCategory[] = Array.from(categoryMap.entries()).map(
			([slug, { title, count }]) => ({
				slug,
				title,
				pageCount: count,
			}),
		)

		categories.sort((a, b) => a.title.localeCompare(b.title))
		pages.sort((a, b) => b.createdAt - a.createdAt)

		cache = { categories, pages, timestamp: Date.now() }
		return { categories, pages }
	} catch (err) {
		// If we have stale cache, serve it rather than failing
		if (cache) {
			console.warn("AFFiNE unavailable, serving stale cache:", err)
			return { categories: cache.categories, pages: cache.pages }
		}
		throw new AffineUnavailableError(
			err instanceof Error ? err.message : "Failed to connect to AFFiNE",
		)
	}
}

export async function getCategories(): Promise<WikiCategory[]> {
	const { categories } = await fetchAllPages()
	return categories
}

export interface WikiPageWithPreview extends WikiPageMeta {
	preview: string
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

export async function getCategoryBySlug(
	slug: string,
): Promise<{ category: WikiCategory; pages: WikiPageWithPreview[] } | null> {
	const { categories, pages } = await fetchAllPages()
	const category = categories.find((c) => c.slug === slug)
	if (!category) return null

	const categoryPages = pages.filter((p) => p.categorySlug === slug)

	const sessionToken = await getSessionToken()
	const reader = createReader(sessionToken)

	const pagesWithPreviews = await Promise.all(
		categoryPages.map(async (page) => {
			try {
				const doc = await reader.getDocMarkdown(page.id)
				return { ...page, preview: extractPreview(doc?.md || "") }
			} catch {
				return { ...page, preview: "" }
			}
		}),
	)

	return { category, pages: pagesWithPreviews }
}

export async function getPageBySlug(
	categorySlug: string,
	pageSlug: string,
): Promise<WikiPage | null> {
	const { pages } = await fetchAllPages()
	const pageMeta = pages.find((p) => p.categorySlug === categorySlug && p.slug === pageSlug)
	if (!pageMeta) return null

	try {
		const sessionToken = await getSessionToken()
		const reader = createReader(sessionToken)
		const doc = await reader.getDocMarkdown(pageMeta.id)
		if (!doc) return null

		return {
			...pageMeta,
			markdown: doc.md || "",
		}
	} catch (err) {
		throw new AffineUnavailableError(
			err instanceof Error ? err.message : "Failed to fetch page content",
		)
	}
}

export async function getRecentPages(limit = 5): Promise<WikiPageWithPreview[]> {
	const { pages } = await fetchAllPages()
	const recentPages = pages.slice(0, limit)

	const sessionToken = await getSessionToken()
	const reader = createReader(sessionToken)

	return Promise.all(
		recentPages.map(async (page) => {
			try {
				const doc = await reader.getDocMarkdown(page.id)
				return { ...page, preview: extractPreview(doc?.md || "") }
			} catch {
				return { ...page, preview: "" }
			}
		}),
	)
}

export async function searchPages(query: string): Promise<WikiPageMeta[]> {
	const { pages } = await fetchAllPages()
	const q = query.toLowerCase()
	return pages.filter(
		(p) => p.title.toLowerCase().includes(q) || p.categoryTitle.toLowerCase().includes(q),
	)
}
