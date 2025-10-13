import { query } from "./_generated/server"

// Verify import - count all data
export const verifyImport = query({
	handler: async (ctx) => {
		const categories = await ctx.db.query("categories").collect()
		const pages = await ctx.db.query("pages").collect()
		const settings = await ctx.db.query("settings").first()

		// Group pages by category
		const pagesByCategory: Record<string, number> = {}
		for (const page of pages) {
			const category = await ctx.db.get(page.categoryId)
			if (category) {
				pagesByCategory[category.slug] = (pagesByCategory[category.slug] || 0) + 1
			}
		}

		return {
			totalCategories: categories.length,
			totalPages: pages.length,
			categories: categories.map((c) => ({
				title: c.title,
				slug: c.slug,
				pageCount: pagesByCategory[c.slug] || 0,
			})),
			settings: settings
				? {
						sitename: settings.sitename,
						subtitle: settings.subtitle,
					}
				: null,
		}
	},
})
