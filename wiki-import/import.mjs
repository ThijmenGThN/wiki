#!/usr/bin/env node

/**
 * Wiki Data Import Tool for Convex
 *
 * This script imports scraped wiki data into a Convex database.
 *
 * Usage:
 *   npm run import              # Import data
 *   npm run import:clear        # Clear existing data and re-import
 *   npm run import:dry-run      # Preview what would be imported
 *
 * Configuration:
 *   Create a .env file with CONVEX_URL
 *   See .env.example for template
 */

import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { ConvexHttpClient } from "convex/browser"
import { config } from "dotenv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
config()

// Configuration
const CONVEX_URL = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL
const DATA_DIR = join(__dirname, "data")

if (!CONVEX_URL) {
	console.error("ERROR: CONVEX_URL not set in .env file")
	console.error("Please copy .env.example to .env and configure CONVEX_URL")
	process.exit(1)
}

/**
 * Load wiki data from JSON file
 */
async function loadWikiData() {
	const dataPath = join(DATA_DIR, "wiki_data.json")

	if (!existsSync(dataPath)) {
		throw new Error(`Wiki data not found at ${dataPath}. Please ensure data/wiki_data.json exists.`)
	}

	const rawData = readFileSync(dataPath, "utf-8")
	return JSON.parse(rawData)
}

/**
 * Main import function
 */
async function main() {
	const args = process.argv.slice(2)
	const clearData = args.includes("--clear")
	const dryRun = args.includes("--dry-run")

	console.log("=".repeat(60))
	console.log("CONVEX WIKI DATA IMPORT TOOL")
	console.log("=".repeat(60))
	console.log(`Convex URL: ${CONVEX_URL}`)
	console.log(`Data directory: ${DATA_DIR}`)
	console.log(`Clear existing data: ${clearData}`)
	console.log(`Dry run: ${dryRun}`)
	console.log("=".repeat(60))
	console.log()

	// Load the data
	console.log("Loading wiki data...")
	const wikiData = await loadWikiData()

	console.log(`Loaded ${wikiData.categories.length} categories and ${wikiData.pages.length} pages`)
	console.log(`Source: ${wikiData.metadata.source_url}`)
	console.log(`Scraped at: ${wikiData.metadata.scraped_at}`)
	console.log()

	if (dryRun) {
		console.log("DRY RUN - No data will be imported")
		console.log()
		console.log("Categories to import:")
		for (const category of wikiData.categories) {
			console.log(`  - ${category.title} (${category.slug})`)
		}
		console.log()
		console.log("Pages to import:")
		const pagesByCategory = wikiData.pages.reduce((acc, page) => {
			const catSlug = page.category.slug
			if (!acc[catSlug]) acc[catSlug] = []
			acc[catSlug].push(page)
			return acc
		}, {})

		for (const [catSlug, pages] of Object.entries(pagesByCategory)) {
			console.log(`  ${catSlug}: ${pages.length} pages`)
			for (const page of pages) {
				console.log(`    - ${page.title} (${page.slug})`)
			}
		}
		return
	}

	// Initialize Convex client
	console.log("Connecting to Convex...")
	const client = new ConvexHttpClient(CONVEX_URL)

	try {
		// Clear existing data if requested
		if (clearData) {
			console.log("Clearing existing wiki data...")
			const result = await client.mutation("import:clearAllWikiData", {})
			console.log(
				`  Deleted ${result.categoriesDeleted} categories and ${result.pagesDeleted} pages`,
			)
			console.log()
		}

		// Initialize settings
		console.log("Initializing settings...")
		await client.mutation("import:initializeSettings", {
			sitename: "Wiki",
			subtitle: "A customizable knowledge base",
			disclaimer: "This is a personal knowledge base.",
		})
		console.log("  Settings initialized")
		console.log()

		// Import categories
		console.log("Importing categories...")
		const categoryIdMap = new Map() // originalId -> convexId

		for (const category of wikiData.categories) {
			try {
				const convexId = await client.mutation("import:importCategory", {
					title: category.title,
					subtitle: category.subtitle,
					slug: category.slug,
					originalId: category.id,
				})
				categoryIdMap.set(category.id, convexId)
				console.log(`  Imported: ${category.title} (${category.slug})`)
			} catch (error) {
				console.error(`  Error importing category ${category.slug}:`, error.message)
			}
		}
		console.log(`  Total: ${categoryIdMap.size} categories imported`)
		console.log()

		// Import pages
		console.log("Importing pages...")
		let importedPages = 0
		let errorCount = 0

		for (const page of wikiData.pages) {
			try {
				await client.mutation("import:importPage", {
					title: page.title,
					subtitle: page.subtitle,
					slug: page.slug,
					markdown: page.markdown,
					categorySlug: page.category.slug,
				})
				importedPages++

				// Progress indicator
				if (importedPages % 10 === 0) {
					console.log(`  Progress: ${importedPages}/${wikiData.pages.length} pages...`)
				}
			} catch (error) {
				console.error(`  Error importing page ${page.slug}:`, error.message)
				errorCount++
			}
		}

		console.log(`  Total: ${importedPages} pages imported`)
		if (errorCount > 0) {
			console.log(`  Errors: ${errorCount}`)
		}
		console.log()

		console.log("=".repeat(60))
		console.log("IMPORT COMPLETED SUCCESSFULLY")
		console.log("=".repeat(60))
		console.log(`Total categories: ${categoryIdMap.size}`)
		console.log(`Total pages: ${importedPages}`)
		console.log()
		console.log("Next steps:")
		console.log("  - Run 'npm run verify' to verify the import")
		console.log("  - View your data in the Convex dashboard")
		console.log("  - Check your application to see the imported content")
	} catch (error) {
		console.error()
		console.error("=".repeat(60))
		console.error("IMPORT FAILED")
		console.error("=".repeat(60))
		console.error(`Error: ${error.message}`)
		console.error()
		console.error("Troubleshooting:")
		console.error("  1. Ensure your Convex deployment is running")
		console.error("  2. Verify CONVEX_URL in .env is correct")
		console.error("  3. Check that convex/import.ts functions exist in your project")
		console.error("  4. Review the full error below:")
		console.error()
		console.error(error)
		process.exit(1)
	} finally {
		client.close()
	}
}

main().catch((error) => {
	console.error("Fatal error:", error)
	process.exit(1)
})
