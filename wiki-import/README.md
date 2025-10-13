# Wiki Import Tool for Convex

A standalone import tool to import scraped wiki data into any Convex instance.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure your Convex URL
cp .env.example .env
# Edit .env and set your CONVEX_URL

# 3. Import the data
npm run import
```

## Prerequisites

- Node.js 18 or higher
- A Convex project with the following:
  - `convex/import.ts` with mutations: `importCategory`, `importPage`, `clearAllWikiData`, `initializeSettings`
  - `convex/verify.ts` with query: `verifyImport` (optional, for verification)
  - Database schema with `categories`, `pages`, and `settings` tables

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file with your Convex deployment URL:

```bash
cp .env.example .env
```

Edit `.env` and set your Convex URL:

```env
# For production deployment
CONVEX_URL=https://your-deployment.convex.cloud

# For local development
CONVEX_URL=http://127.0.0.1:3210
```

### 3. Prepare Data

The `data/` folder should contain `wiki_data.json` with your scraped wiki content. This file should have the structure:

```json
{
  "categories": [
    {
      "id": 1,
      "title": "Category Name",
      "subtitle": "Category description",
      "slug": "category-slug"
    }
  ],
  "pages": [
    {
      "id": 1,
      "title": "Page Title",
      "subtitle": "Page description",
      "slug": "page-slug",
      "markdown": "# Page content...",
      "category": {
        "id": 1,
        "slug": "category-slug"
      }
    }
  ],
  "metadata": {
    "scraped_at": "2024-01-01T00:00:00Z",
    "source_url": "https://example.com",
    "total_categories": 5,
    "total_pages": 69
  }
}
```

## Usage

### Import Commands

```bash
# Import data (skips existing entries)
npm run import

# Clear all existing wiki data and re-import
npm run import:clear

# Dry run - preview what would be imported without importing
npm run import:dry-run

# Verify the import
npm run verify
```

### Command Options

- `npm run import` - Default import, skips entries that already exist
- `npm run import:clear` - Deletes all existing categories and pages before importing
- `npm run import:dry-run` - Shows what would be imported without making changes
- `npm run verify` - Verifies the import by querying the database

## Required Convex Functions

Your Convex project must have these functions defined:

### `convex/import.ts`

```typescript
import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const importCategory = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    slug: v.string(),
    originalId: v.number(),
  },
  handler: async (ctx, args) => {
    // Implementation...
  }
})

export const importPage = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    slug: v.string(),
    markdown: v.string(),
    categorySlug: v.string(),
  },
  handler: async (ctx, args) => {
    // Implementation...
  }
})

export const clearAllWikiData = mutation({
  handler: async (ctx) => {
    // Implementation...
  }
})

export const initializeSettings = mutation({
  args: {
    sitename: v.string(),
    subtitle: v.string(),
    disclaimer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Implementation...
  }
})
```

### `convex/verify.ts` (optional)

```typescript
import { query } from "./_generated/server"

export const verifyImport = query({
  handler: async (ctx) => {
    // Return categories, pages, and settings for verification
  }
})
```

## Troubleshooting

### "CONVEX_URL not set in .env file"

Make sure you've created a `.env` file and set the `CONVEX_URL` variable.

### "Wiki data not found"

Ensure `data/wiki_data.json` exists and contains valid JSON data.

### "Cannot connect to Convex"

- For local development: Make sure your Convex dev server is running
- For production: Verify your CONVEX_URL is correct and the deployment is active

### Import functions not found

Ensure your Convex project has the required mutations in `convex/import.ts`.

### Import takes too long

The script imports data sequentially to avoid overwhelming the database. For large datasets (100+ pages), expect 2-5 minutes.

## Data Structure

### Categories

- `title` - Display name of the category
- `subtitle` - Short description
- `slug` - URL-friendly identifier (must be unique)

### Pages

- `title` - Display name of the page
- `subtitle` - Short description
- `slug` - URL-friendly identifier (must be unique)
- `markdown` - Full markdown content
- `categorySlug` - Reference to parent category

### Settings

- `sitename` - Name of the wiki
- `subtitle` - Tagline or description
- `disclaimer` - Optional disclaimer text

## Project Structure

```
wiki-import/
├── data/
│   └── wiki_data.json        # Your scraped wiki data
├── import.mjs                # Main import script
├── verify.mjs                # Verification script
├── package.json              # Dependencies and scripts
├── .env                      # Configuration (create from .env.example)
├── .env.example              # Configuration template
└── README.md                 # This file
```

## License

This tool is part of your wiki project and follows the same license.
