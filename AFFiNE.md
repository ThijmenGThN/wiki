# Wiki → AFFiNE Migration

## Goal
Replace Convex as the content source with a self-hosted AFFiNE instance. All wiki pages should be fetched from AFFiNE docs at build/request time.

## Environment variables needed
```
AFFINE_BASE_URL=https://your-affine-instance.com
AFFINE_EMAIL=your@email.com
AFFINE_PASSWORD=yourpassword
AFFINE_WORKSPACE_ID=your-workspace-id
```

Add these to `.env.local` (and document them in `.env.example`).

---

## Step 1 — Explore the existing codebase

Before touching anything:
- Find where Convex is used: `grep -r "convex" . --include="*.ts" --include="*.tsx" -l`
- Understand the data shape currently returned (what fields does the wiki expect per page: title, slug, content, category, etc.)
- Find the data fetching layer (likely a `lib/` or `api/` folder, or Convex query files)
- Note how pages are rendered (SSG, SSR, or client-side)

---

## Step 2 — Install dependencies

```bash
npm install yjs
```

If the BlockSuite package is too heavy, `yjs` alone is sufficient to decode plain text and paragraph blocks from AFFiNE docs.

---

## Step 3 — Create the AFFiNE client

Create `lib/affine.ts` (or `.js`) with the following functionality:

### 3a. Auth
POST to `${AFFINE_BASE_URL}/api/auth/sign-in` with `{ email, password }`.
Store the returned session cookie or token for subsequent requests.

If the instance uses GraphQL-based auth, use this mutation instead:
```graphql
mutation {
  signIn(email: "...", password: "...") {
    token { token }
  }
}
```

### 3b. List all docs in the workspace
GraphQL query against `${AFFINE_BASE_URL}/graphql`:
```graphql
query {
  workspace(id: "WORKSPACE_ID") {
    docs {
      id
      title
    }
  }
}
```

### 3c. Fetch a single doc's binary content
```
GET ${AFFINE_BASE_URL}/api/workspaces/${workspaceId}/docs/${docId}
```
This returns a binary Yjs update (Uint8Array).

### 3d. Decode Yjs binary → readable content
```ts
import * as Y from 'yjs'

function decodeAffineDoc(binary: Uint8Array): string {
  const doc = new Y.Doc()
  Y.applyUpdate(doc, binary)

  const blocks = doc.getMap('blocks')
  const lines: string[] = []

  blocks.forEach((block: any) => {
    const flavour = block.get?.('sys:flavour') ?? ''
    const text: Y.Text = block.get?.('prop:text')
    if (text && typeof text.toString === 'function') {
      lines.push(text.toString())
    }
  })

  return lines.filter(Boolean).join('\n')
}
```

> Note: AFFiNE's block structure uses a flat map of blocks keyed by block ID, each with `sys:flavour` (e.g. `affine:paragraph`, `affine:code`, `affine:list`) and `prop:text`. Walk all blocks and reconstruct order using `sys:children` arrays on the root block if needed.

---

## Step 4 — Replace Convex data fetching

- Find every file that calls Convex queries (e.g. `useQuery`, `fetchQuery`, `api.wiki.*`)
- Replace them with calls to the new `lib/affine.ts` functions
- Map the AFFiNE doc shape to whatever the wiki components expect:
  - `id` → slug (slugify the title or use the doc ID)
  - decoded text → `content`
  - `title` from the GraphQL listing → `title`
  - Category/tags: check if AFFiNE tags are used in the workspace, otherwise derive from folder structure or page title prefix

---

## Step 5 — Handle slug/routing

AFFiNE doc IDs are UUIDs, not human-readable slugs. Two options:
1. Use the doc `title` slugified as the URL slug, and look up by title match when routing
2. Store a slug mapping in a small local JSON file or use a naming convention in AFFiNE (e.g. prefix doc title with `slug:docker/bazarr`)

Pick option 1 unless there are title collisions.

---

## Step 6 — Remove Convex

- Uninstall Convex packages: `npm uninstall convex`
- Remove `convex/` folder and generated files
- Remove Convex provider from `_app.tsx` / layout files
- Remove any `CONVEX_URL` env vars from `.env` files and deployment config

---

## Step 7 — Test

- Run the dev server and verify pages render content from AFFiNE
- Test a doc with code blocks (docker-compose content) — verify the `affine:code` block flavour is decoded correctly and rendered in a `<pre>` / code block component
- Test the doc listing / index page
- Check that 404s work for missing slugs

---

## Code block decoding note

For `affine:code` blocks, the `prop:text` field contains the raw code. The `prop:language` field contains the language hint. Make sure these are passed through to the existing code highlighting component rather than rendered as plain text.

---

## Auth token refresh

AFFiNE sessions expire. If the wiki is SSR/ISR, re-authenticate at the start of each build or request cycle rather than caching the token long-term. If it's a static build, authenticate once at build time.