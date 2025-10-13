# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

next-leaflet is a modern full-stack web application template built with Next.js 15, React 19, and Convex as the backend. It provides authentication, database, and a comprehensive UI component library out of the box.

## Development Commands

### Starting Development
```bash
npm run dev              # Runs both frontend and backend in parallel
npm run dev:frontend     # Next.js dev server only (port 3000)
npm run dev:backend      # Convex dev server only
```

The `npm run dev` command has a `predev` hook that:
1. Waits for Convex to be ready (`convex dev --until-success`)
2. Runs the `setup.mjs` script once to configure JWT keys and SMTP
3. Opens the Convex dashboard

### Code Quality
```bash
npm run lint             # Check code with Biome
npm run lint:fix         # Auto-fix issues with Biome
npm run format           # Format code with Biome
```

### Building
```bash
npm run build            # Build Next.js for production
npm start                # Start production server
```

### Email Development
```bash
npm run email            # Start react-email dev server
```

## Architecture

### Frontend Structure (Next.js App Router)
- `src/app/(home)/` - Public landing pages
- `src/app/(auth)/` - Auth pages (login, register, reset) - redirects to /dash if authenticated
- `src/app/dash/` - Protected dashboard routes - requires authentication
- `src/components/` - Reusable components
- `src/components/ui/` - shadcn/ui components
- `src/middleware.ts` - Route protection using Convex Auth middleware

### Backend Structure (Convex)
- `convex/schema.ts` - Database schema with Convex Auth tables
- `convex/auth.ts` - Convex Auth configuration with Password provider and email reset
- `convex/auth.config.ts` - Additional auth configuration
- `convex/http.ts` - HTTP routes (currently just auth routes)
- `convex/users.ts` - User queries and mutations (current, updateName, updateTheme)
- `convex/email.ts` - Email sending logic using nodemailer (Node.js runtime)
- `convex/_generated/` - Auto-generated types and API

### Authentication Flow
1. Authentication uses `@convex-dev/auth` with Password provider
2. Middleware in `src/middleware.ts` protects routes:
   - Unauthenticated users trying to access `/dash` → redirected to `/login`
   - Authenticated users trying to access `/login` or `/register` → redirected to `/dash`
3. Password reset flow:
   - User requests reset on `/reset` page
   - Email sent via `convex/email.ts` using nodemailer
   - Reset link contains token and email
   - `src/emails/Reset.tsx` is the email template (react-email)
4. Auth state available via `useAuthActions()` (client) and `auth.getUserId(ctx)` (server)
5. Error handling in `src/lib/auth-errors.ts` provides user-friendly messages

### Key Patterns

**Convex Queries/Mutations Pattern:**
```typescript
// Define in convex/*.ts
export const myQuery = query({
  args: { id: v.id("tableName") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) throw new Error("Not authenticated")
    return await ctx.db.get(args.id)
  }
})

// Use in components
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

const data = useQuery(api.fileName.myQuery, { id })
const doMutation = useMutation(api.fileName.myMutation)
```

**Protected Routes:**
- Place new protected pages in `src/app/dash/` for automatic protection
- Or update `isProtectedRoute` matcher in `src/middleware.ts`

**Convex Actions (Node.js runtime):**
- Use `"use node"` directive at top of file for Node.js-only APIs (like nodemailer)
- Define with `internalAction` for internal-only access
- Call from mutations/queries: `await ctx.runAction(internal.module.action, args)`

### Configuration

**Environment Setup:**
1. Copy `.env.sample` to `.env.local`
2. Set `NEXT_PUBLIC_DOMAIN` (defaults to http://localhost:3000)
3. Configure SMTP for password reset emails (optional):
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `MAIL_DEFAULT_NAME`, `MAIL_DEFAULT_ADDRESS`
4. The `setup.mjs` script runs on first dev and configures:
   - JWT keys for Convex Auth
   - SITE_URL in Convex environment
   - SMTP variables in Convex environment

**Schema Changes:**
- Modify `convex/schema.ts`
- Convex dev server auto-syncs changes
- Types regenerate in `convex/_generated/`

**Adding shadcn/ui Components:**
```bash
npx shadcn@latest add [component-name]
```
Components are added to `src/components/ui/` and fully customizable.

### Theme System
- Uses `next-themes` for theme switching
- Theme preference stored in Convex database (users.theme)
- `ThemeSync` component syncs browser theme with database
- Theme values: "light", "dark", "system"
- Customize colors in `src/styles/globals.css` CSS variables

### Important Notes
- Convex functions use TypeScript with Zod-like validators (`v` from "convex/values")
- All Convex types are auto-generated - never modify `_generated/` directly
- Use `ConvexClientProvider` wrapper in app layout for client-side Convex access
- Error messages from Convex Auth are parsed in `src/lib/auth-errors.ts`
- Database schema includes auth tables from `authTables` (required for Convex Auth)
