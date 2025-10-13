#!/usr/bin/env node
/**
 * Verify Wiki Data Import
 *
 * Checks that all data was imported successfully to Convex
 */

import { ConvexHttpClient } from "convex/browser"
import { config } from "dotenv"

// Load environment variables
config()

const CONVEX_URL = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL

if (!CONVEX_URL) {
	console.error("ERROR: CONVEX_URL not set in .env file")
	console.error("Please copy .env.example to .env and configure CONVEX_URL")
	process.exit(1)
}

async function main() {
	console.log("=".repeat(60))
	console.log("VERIFYING CONVEX IMPORT")
	console.log("=".repeat(60))
	console.log(`Convex URL: ${CONVEX_URL}`)
	console.log()

	const client = new ConvexHttpClient(CONVEX_URL)

	try {
		const result = await client.query("verify:verifyImport", {})

		console.log(`Total Categories: ${result.totalCategories}`)
		console.log(`Total Pages: ${result.totalPages}`)
		console.log()

		console.log("Categories and Page Counts:")
		for (const category of result.categories) {
			console.log(`  - ${category.title} (${category.slug}): ${category.pageCount} pages`)
		}
		console.log()

		if (result.settings) {
			console.log("Settings:")
			console.log(`  Site Name: ${result.settings.sitename}`)
			console.log(`  Subtitle: ${result.settings.subtitle}`)
		}

		console.log()
		console.log("=".repeat(60))
		console.log("VERIFICATION COMPLETE")
		console.log("=".repeat(60))
	} catch (error) {
		console.error("Verification failed:", error.message)
		console.error()
		console.error("This may mean:")
		console.error("  - The verify:verifyImport query doesn't exist in your Convex project")
		console.error("  - No data has been imported yet")
		console.error("  - The Convex URL is incorrect")
		process.exit(1)
	} finally {
		client.close()
	}
}

main().catch((error) => {
	console.error("Fatal error:", error)
	process.exit(1)
})
