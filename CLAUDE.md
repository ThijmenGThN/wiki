# CLAUDE.md

## Project Overview

A wiki/knowledge base built with Next.js 15 App Router. Content is sourced from a self-hosted AFFiNE instance via `affine-reader`. Page view counts are stored locally in SQLite (`better-sqlite3`). Styled with Tailwind CSS v4 and shadcn/ui components.

## Development Commands

```bash
npm run dev        # Start Next.js dev server
npm run build      # Build for production (standalone output)
npm start          # Start production server

npm run lint       # Check code with Biome
npm run lint:fix   # Auto-fix linting issues
npm run format     # Format code with Biome
```

## Architecture

### Data Sources

- **AFFiNE** (`src/lib/affine.ts`) — Fetches wiki pages and metadata from a self-hosted AFFiNE instance. Pages are organized into categories via AFFiNE tags. Results are cached with `unstable_cache` (60s revalidation).
- **SQLite** (`src/lib/db.ts`) — Tracks page view counts in `data/views.db`. Uses WAL mode, IP-hashed deduplication (1hr window), daily-rotating salt for privacy.

### Routes

- `src/app/(home)/` — Public wiki pages (home, category listing, individual pages)
- `src/app/api/` — API routes
- `src/app/not-found.tsx` — 404 page

### Environment Variables

Defined in `.env.local`:
- `AFFINE_BASE_URL` — AFFiNE instance URL
- `AFFINE_EMAIL` / `AFFINE_PASSWORD` — AFFiNE credentials
- `AFFINE_WORKSPACE_ID` — AFFiNE workspace ID
- `NEXT_PUBLIC_DOMAIN` — Public domain (production: `https://wiki.nantric.com`)

### UI

- shadcn/ui components in `src/components/ui/`
- Custom wiki components in `src/components/wiki/`
- Tailwind CSS v4 with CSS variables in `src/styles/globals.css`

## Deployment

Deployed via Dokku on the `wiki` server.

- **Dockerfile** — Multi-stage build with standalone output, runs as non-root `nextjs` user on port 3000
- **docker-compose.yml** — For local Docker testing, mounts `./data:/app/data` for persistent views.db
- **Persistent storage** — `data/views.db` must survive deploys (Dokku persistent storage mount to `/app/data`)

## Notes

- **Biome** is used for linting/formatting (not ESLint/Prettier)
- **No authentication** — this is a public-facing wiki
- **No Convex** — the project used to use Convex but has been fully migrated to AFFiNE + SQLite
