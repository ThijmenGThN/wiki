# next-leaflet

![preview](https://i.imgur.com/oulW1VO.png)

An optimized tech stack for efficiency, an all-in-one solution to quickly build modern web apps.

### Powered by

- [Next.js](https://nextjs.org) - React framework with App Router
- [Convex](https://convex.dev) - Backend database and serverless functions

### Features

- **Backend**: Convex for database and server logic
- **Authentication**: Convex Auth with password provider
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Dark Mode**: Theme switching with next-themes
- **Type Safety**: Full TypeScript support with auto-generated types
- **Code Quality**: Biome for linting and formatting

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Convex (database + serverless functions)
- **Auth**: @convex-dev/auth with Password provider
- **Icons**: Lucide React
- **Linting**: Biome

## Getting Started

1. Install dependencies:
	```bash
	npm install
	```

2. Copy the environment variables file:
	```bash
	cp .env.sample .env.local
	```

3. Start the development server:
	```bash
	npm run dev
	```

This will:
- Start both Next.js (port 3000) and Convex dev servers
- Automatically configure Convex Auth
- Open the Convex dashboard

4. The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run dev:frontend` - Start only Next.js dev server
- `npm run dev:backend` - Start only Convex dev server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Check code with Biome
- `npm run lint:fix` - Fix issues automatically
- `npm run format` - Format code with Biome

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (home)/            # Public home routes
│   ├── (auth)/            # Authentication pages
│   └── dash/              # Protected dashboard routes
├── components/            # Reusable React components
│   └── ui/                # shadcn/ui components
├── styles/                # Global styles
└── middleware.ts          # Route protection

convex/
├── schema.ts              # Database schema
├── auth.ts                # Convex Auth configuration
├── http.ts                # HTTP endpoints
└── _generated/            # Auto-generated types
```

## Authentication

The app includes a complete authentication setup:
- Password-based authentication via Convex Auth
- Protected routes (middleware redirects)
- Server-side and client-side auth state
- User management with profile fields

Routes:
- `/login` and `/register` - Auth pages (redirect to `/dash` if authenticated)
- `/dash` - Protected dashboard (requires authentication)

## Common Workflows

<details>
<summary>Adding a New UI Component</summary>

This project uses shadcn/ui components. To add a new component:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
# etc.
```

Components will be added to `src/components/ui/` and are fully customizable.

</details>

<details>
<summary>Creating Convex Functions</summary>

1. Create a new file in the `convex/` directory (e.g., `convex/tasks.ts`)
2. Define your queries, mutations, or actions:

```typescript
import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("tasks").collect()
	},
})

export const create = mutation({
	args: { text: v.string() },
	handler: async (ctx, args) => {
		await ctx.db.insert("tasks", { text: args.text })
	},
})
```

3. Import and use in your components:

```typescript
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

const tasks = useQuery(api.tasks.list)
const createTask = useMutation(api.tasks.create)
```

</details>

<details>
<summary>Protecting Routes</summary>

Routes are protected via middleware in `src/middleware.ts`. To add authentication to a new route:

1. Add the route pattern to the middleware matcher
2. Or place the route under the `/dash` directory for automatic protection

</details>

<details>
<summary>Customizing Themes</summary>

Themes are configured in `src/styles/globals.css`. Modify CSS variables to customize colors:

```css
@layer base {
	:root {
		--background: 0 0% 100%;
		--foreground: 222.2 84% 4.9%;
		/* ... customize other colors */
	}
}
```

</details>

## Production Deployment

<details>
<summary>Using Vercel (Recommended)</summary>

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `CONVEX_DEPLOYMENT` environment variable (from Convex dashboard)
4. Deploy

</details>

<details>
<summary>Convex Setup for Production</summary>

1. Run `npx convex deploy` to create a production deployment
2. Copy the production deployment URL to your hosting platform's environment variables
3. Configure authentication secrets in the Convex dashboard

</details>

## Environment Variables

<details>
<summary>View environment variables</summary>

Key environment variables:

- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL (auto-configured during dev)
- `CONVEX_DEPLOYMENT` - Production Convex deployment name

</details>

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Convex Auth Documentation](https://labs.convex.dev/auth)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
