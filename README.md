# next-leaflet

![preview](https://i.imgur.com/oulW1VO.png)

**A production-ready Next.js template with authentication, database, and email built-in.**

Perfect for building modern web applications without the hassle of setting up authentication, databases, or email systems from scratch. Everything is configured and ready to go.

---

## What's Inside?

This template gives you a complete full-stack web application with:

- **User Authentication** - Sign up, log in, password reset, and GitHub OAuth
- **Database** - Convex database with real-time updates and type safety
- **Email System** - Password reset emails with beautiful templates
- **Modern UI** - 50+ pre-built components with dark mode support
- **Type Safety** - Full TypeScript support throughout
- **Developer Experience** - Hot reload, linting, formatting all configured

## Tech Stack

**Frontend:**
- [Next.js 15](https://nextjs.org) - React framework with App Router
- [React 19](https://react.dev) - Latest React with modern features
- [Tailwind CSS v4](https://tailwindcss.com) - Utility-first styling
- [shadcn/ui](https://ui.shadcn.com) - Beautiful, accessible components

**Backend:**
- [Convex](https://convex.dev) - Database and serverless functions
- [Convex Auth](https://labs.convex.dev/auth) - Authentication system
- [Node.js](https://nodejs.org) - Server-side runtime for emails

**Tools:**
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Biome](https://biomejs.dev) - Fast linter and formatter
- [react-email](https://react.email) - Email template builder

---

## Quick Start

### Prerequisites

You'll need:
- **Node.js** version 18 or higher ([download here](https://nodejs.org))
- **npm** (comes with Node.js)
- A code editor like [VS Code](https://code.visualstudio.com)

That's it! Everything else is included.

### Option 1: Cloud Setup (Easiest)

This is the fastest way to get started. Uses Convex's free cloud service.

1. **Clone or download this template**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment**
   ```bash
   cp .env.sample .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

That's it! The app is now running with a locally-hosted Convex backend. The first time you run `npm run dev`, it will:
- Create a Convex deployment
- Generate secure authentication keys
- Open the Convex dashboard
- Start the development server

### Option 2: Self-Hosted Setup

Want complete control? Run everything locally with Docker.

1. **Clone or download this template**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Docker services**
   ```bash
   docker compose -f docker-compose.convex.yaml up -d
   ```

   This starts:
   - Convex backend (ports 3210, 3211)
   - Convex dashboard (port 6791)
   - PostgreSQL database (port 5432)

4. **Set up your environment**
   ```bash
   cp .env.sample .env.local
   ```

   Edit `.env.local` and uncomment the self-hosted section:
   ```bash
   # Comment out or remove this line:
   # CONVEX_DEPLOYMENT=anonymous:anonymous-next-leaflet

   # Uncomment these lines:
   CONVEX_SELF_HOSTED_URL='http://localhost:3210'
   CONVEX_SELF_HOSTED_ADMIN_KEY='next-leaflet|017...516'
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

   Access the Convex dashboard at [http://localhost:6791](http://localhost:6791)

---

## What Can You Do Right Now?

Once your development server is running, you can:

### Create an Account
1. Click "Sign Up" or visit [http://localhost:3000/register](http://localhost:3000/register)
2. Enter your email, name, and password
3. You'll be automatically logged in and redirected to the dashboard

### Sign In with GitHub (Optional)
1. Set up GitHub OAuth (see [GitHub OAuth Setup](#github-oauth-setup))
2. Click "Continue with GitHub" on the login page
3. Authorize the app and you're in

### Reset Your Password
1. Click "Forgot Password?" on the login page
2. Enter your email
3. Check your email for the reset link (requires [Email Setup](#email-setup))

### Explore the Dashboard
- View your profile information
- Switch between light and dark themes
- Update your name
- See real-time data updates

---

## Understanding the Project

### Project Structure

```
next-leaflet/
│
├── src/                          # Frontend code
│   ├── app/                      # Next.js pages
│   │   ├── (home)/               # Public landing page
│   │   ├── (auth)/               # Login, register, reset pages
│   │   └── dash/                 # Protected dashboard pages
│   │
│   ├── components/               # Reusable React components
│   │   └── ui/                   # Pre-built UI components
│   │
│   ├── emails/                   # Email templates
│   │   └── Reset.tsx             # Password reset email
│   │
│   ├── lib/                      # Utility functions
│   └── styles/                   # Global styles and themes
│
├── convex/                       # Backend code
│   ├── schema.ts                 # Database structure
│   ├── auth.ts                   # Authentication logic
│   ├── users.ts                  # User-related functions
│   ├── email.ts                  # Email sending logic
│   └── _generated/               # Auto-generated types
│
├── .env.local                    # Your environment variables (not in git)
├── .env.sample                   # Template for environment variables
└── setup.mjs                     # Automatic setup script
```

### How Authentication Works

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. User signs up/logs in
       ↓
┌─────────────────┐
│   Next.js App   │
└────────┬────────┘
         │ 2. Sends credentials
         ↓
┌──────────────────┐
│  Convex Auth     │  3. Validates & creates JWT token
└────────┬─────────┘
         │ 4. Returns token
         ↓
┌─────────────────┐
│   Next.js App   │  5. Stores token in cookies
└────────┬────────┘
         │ 6. Includes token in all requests
         ↓
┌──────────────────┐
│  Convex Backend  │  7. Verifies token & returns user data
└──────────────────┘
```

**Protected Routes:**
- Any page in `src/app/dash/` requires authentication
- If not logged in, users are redirected to `/login`
- If already logged in, visiting `/login` redirects to `/dash`

### How the Database Works

Convex gives you a real-time database with automatic type safety.

**Define your schema** (`convex/schema.ts`):
```typescript
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
})
```

**Create backend functions** (`convex/tasks.ts`):
```typescript
import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

// Read data
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect()
  },
})

// Write data
export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", {
      text: args.text,
      completed: false
    })
  },
})
```

**Use in your components**:
```typescript
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function TaskList() {
  // Auto-updates when data changes!
  const tasks = useQuery(api.tasks.list)
  const createTask = useMutation(api.tasks.create)

  return (
    <div>
      {tasks?.map(task => (
        <div key={task._id}>{task.text}</div>
      ))}
      <button onClick={() => createTask({ text: "New task" })}>
        Add Task
      </button>
    </div>
  )
}
```

**That's it!** No API routes, no REST endpoints, no GraphQL. Just functions.

---

## Available Commands

```bash
# Development
npm run dev              # Start everything (frontend + backend)
npm run dev:frontend     # Start only Next.js (port 3000)
npm run dev:backend      # Start only Convex backend

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Check code for issues
npm run lint:fix         # Auto-fix issues
npm run format           # Format all code

# Email Development
npm run email            # Preview and edit email templates
```

---

## Configuration Guide

### GitHub OAuth Setup

Add one-click "Continue with GitHub" login to your app.

1. **Create a GitHub OAuth App**
   - Go to [github.com/settings/developers](https://github.com/settings/developers)
   - Click **"New OAuth App"**
   - Fill in the form:
     - **Application name**: Your App Name
     - **Homepage URL**: `http://localhost:3000`
     - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
   - Click **"Register application"**

2. **Get your credentials**
   - Copy the **Client ID**
   - Click **"Generate a new client secret"** and copy it

3. **Add to your environment**

   Edit `.env.local`:
   ```bash
   AUTH_GITHUB_ID=Ov23li...your-client-id
   AUTH_GITHUB_SECRET=ghp_...your-client-secret
   ```

4. **Restart your dev server**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

The GitHub sign-in button will automatically appear on login and registration pages.

**For production:** Update the URLs in your GitHub OAuth App settings to your production domain.

### Email Setup

Send password reset emails and other transactional emails.

1. **Get SMTP credentials**

   You'll need an SMTP email service. Free options:
   - [Resend](https://resend.com) - 100 emails/day free
   - [SendGrid](https://sendgrid.com) - 100 emails/day free
   - [Gmail](https://support.google.com/mail/answer/7126229) - Personal use only

2. **Add credentials to `.env.local`**
   ```bash
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=re_your_api_key_here
   MAIL_DEFAULT_NAME="My App"
   MAIL_DEFAULT_ADDRESS="noreply@myapp.com"
   ```

3. **Restart your dev server**
   ```bash
   npm run dev
   ```

**That's it!** Password reset emails will now be sent automatically.

**Customize email templates:**
```bash
npm run email
```

This opens a preview server at [http://localhost:8086](http://localhost:8086) where you can see and edit your email templates in `src/emails/`.

### Environment Variables Reference

<details>
<summary>Click to see all environment variables</summary>

**Next.js Configuration:**
```bash
# Your app's URL (change for production)
NEXT_PUBLIC_DOMAIN=http://localhost:3000

# Convex connection (auto-configured in dev)
NEXT_PUBLIC_CONVEX_URL=http://localhost:3210
```

**Convex Configuration (choose one):**

*Option 1 - Cloud (default):*
```bash
CONVEX_DEPLOYMENT=anonymous:anonymous-next-leaflet
```

*Option 2 - Self-hosted:*
```bash
CONVEX_SELF_HOSTED_URL=http://localhost:3210
CONVEX_SELF_HOSTED_ADMIN_KEY=next-leaflet|your-admin-key
```

**GitHub OAuth (optional):**
```bash
AUTH_GITHUB_ID=Ov23li...
AUTH_GITHUB_SECRET=ghp_...
```

**Email SMTP (optional):**
```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
MAIL_DEFAULT_NAME="Your App"
MAIL_DEFAULT_ADDRESS=noreply@yourapp.com
```

**Auto-generated (don't touch):**
```bash
# These are automatically generated by setup.mjs
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY----- ..."
JWKS='{"keys":[...]}'
```

</details>

---

## Common Tasks

### Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com) - a collection of beautiful, accessible components.

**Browse available components:** [ui.shadcn.com](https://ui.shadcn.com)

**Add a component:**
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

Components are added to `src/components/ui/` and are fully customizable.

**Use in your app:**
```typescript
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function MyPage() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  )
}
```

### Creating a New Page

**Public page** (accessible to everyone):

1. Create `src/app/(home)/about/page.tsx`:
   ```typescript
   export default function AboutPage() {
     return (
       <div>
         <h1>About Us</h1>
         <p>This is a public page</p>
       </div>
     )
   }
   ```

2. Visit [http://localhost:3000/about](http://localhost:3000/about)

**Protected page** (requires login):

1. Create `src/app/dash/settings/page.tsx`:
   ```typescript
   export default function SettingsPage() {
     return (
       <div>
         <h1>Settings</h1>
         <p>This page requires authentication</p>
       </div>
     )
   }
   ```

2. Visit [http://localhost:3000/dash/settings](http://localhost:3000/dash/settings)

The middleware automatically protects any route under `/dash`.

### Adding Database Tables

1. **Define your schema** in `convex/schema.ts`:
   ```typescript
   export default defineSchema({
     // Existing tables...
     tasks: defineTable({
       text: v.string(),
       completed: v.boolean(),
       userId: v.id("users"),
     }).index("by_user", ["userId"]),
   })
   ```

2. **Create backend functions** in `convex/tasks.ts`:
   ```typescript
   import { v } from "convex/values"
   import { mutation, query } from "./_generated/server"
   import { auth } from "./auth"

   export const list = query({
     args: {},
     handler: async (ctx) => {
       const userId = await auth.getUserId(ctx)
       if (!userId) throw new Error("Not authenticated")

       return await ctx.db
         .query("tasks")
         .withIndex("by_user", (q) => q.eq("userId", userId))
         .collect()
     },
   })

   export const create = mutation({
     args: { text: v.string() },
     handler: async (ctx, args) => {
       const userId = await auth.getUserId(ctx)
       if (!userId) throw new Error("Not authenticated")

       await ctx.db.insert("tasks", {
         text: args.text,
         completed: false,
         userId,
       })
     },
   })
   ```

3. **Use in your components**:
   ```typescript
   import { useQuery, useMutation } from "convex/react"
   import { api } from "@/convex/_generated/api"

   export default function Tasks() {
     const tasks = useQuery(api.tasks.list)
     const createTask = useMutation(api.tasks.create)

     return (
       <div>
         {tasks?.map(task => (
           <div key={task._id}>{task.text}</div>
         ))}
         <button onClick={() => createTask({ text: "New task" })}>
           Add
         </button>
       </div>
     )
   }
   ```

**The types are generated automatically!** No manual type definitions needed.

### Customizing Themes

Colors are defined in `src/styles/globals.css`.

**Change the color scheme:**
```css
@layer base {
  :root {
    --background: 0 0% 100%;          /* White */
    --foreground: 222.2 84% 4.9%;     /* Dark text */
    --primary: 221.2 83.2% 53.3%;     /* Blue */
    --primary-foreground: 210 40% 98%; /* Light text on primary */
    /* ... more colors */
  }

  .dark {
    --background: 222.2 84% 4.9%;     /* Dark */
    --foreground: 210 40% 98%;         /* Light text */
    --primary: 217.2 91.2% 59.8%;     /* Lighter blue */
    /* ... more colors */
  }
}
```

**Use the shadcn theme editor:** [ui.shadcn.com/themes](https://ui.shadcn.com/themes)

Copy and paste the generated CSS into `globals.css`.

### Deploying to Production

<details>
<summary><strong>Deploy to Vercel (Recommended)</strong></summary>

Vercel is made by the creators of Next.js and provides the best deployment experience.

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Create a Convex production deployment**
   ```bash
   npx convex deploy
   ```

   This creates a production Convex backend. Copy the deployment URL shown.

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New Project"**
   - Import your GitHub repository
   - Add environment variables:
     - `CONVEX_DEPLOYMENT` - Your Convex deployment URL
     - `NEXT_PUBLIC_DOMAIN` - Your production URL (e.g., `https://myapp.vercel.app`)
   - Click **"Deploy"**

4. **Configure GitHub OAuth for production**
   - Update your GitHub OAuth App callback URL to:
     `https://your-app.vercel.app/api/auth/callback/github`

5. **Add production SMTP credentials**
   - Add your SMTP variables to Vercel environment variables
   - Or use Convex dashboard to set them

**Done!** Your app is live.

</details>

<details>
<summary><strong>Deploy to Other Platforms</strong></summary>

You can deploy to any platform that supports Next.js:

**Platforms:**
- [Netlify](https://www.netlify.com)
- [Railway](https://railway.app)
- [Render](https://render.com)
- [Fly.io](https://fly.io)

**Steps:**
1. Create a production Convex deployment: `npx convex deploy`
2. Set these environment variables on your platform:
   - `CONVEX_DEPLOYMENT` - Your Convex deployment URL
   - `NEXT_PUBLIC_DOMAIN` - Your production domain
   - `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` (if using GitHub OAuth)
   - SMTP variables (if using email)
3. Deploy your code

</details>

<details>
<summary><strong>Self-Host Everything</strong></summary>

Run the entire stack on your own server.

1. **Set up your server** (Ubuntu/Debian example):
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get install -y nodejs
   ```

2. **Clone your repository**
   ```bash
   git clone https://github.com/yourusername/your-app.git
   cd your-app
   npm install
   ```

3. **Start Docker services**
   ```bash
   docker compose -f docker-compose.convex.yaml up -d
   ```

4. **Build the Next.js app**
   ```bash
   npm run build
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

6. **Set up a reverse proxy** (nginx example):
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

7. **Add SSL with Let's Encrypt**
   ```bash
   apt-get install certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com
   ```

</details>

---

## Troubleshooting

<details>
<summary><strong>Port already in use</strong></summary>

If you see `Error: Port 3000 is already in use`:

**Find what's using the port:**
```bash
# macOS/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

**Kill the process or use a different port:**
```bash
# Use a different port
PORT=3001 npm run dev
```

</details>

<details>
<summary><strong>Convex connection errors</strong></summary>

If the app can't connect to Convex:

1. **Check your `.env.local` file**
   - Make sure `NEXT_PUBLIC_CONVEX_URL` is set correctly
   - For cloud: Should be auto-configured
   - For self-hosted: Should be `http://localhost:3210`

2. **Restart the Convex dev server**
   ```bash
   npx convex dev
   ```

3. **Clear your browser cache and cookies**

4. **Check Docker is running** (self-hosted only):
   ```bash
   docker compose -f docker-compose.convex.yaml ps
   ```

</details>

<details>
<summary><strong>Email not sending</strong></summary>

If password reset emails aren't sending:

1. **Check SMTP configuration in `.env.local`**
   - Verify all SMTP variables are set correctly
   - Test your SMTP credentials with your provider

2. **Check Convex environment variables**
   ```bash
   npx convex env list
   ```

   SMTP variables should be there. If not, restart dev server.

3. **Check the Convex logs**
   - Open the Convex dashboard
   - Look for error messages in the logs

4. **Test with a different SMTP provider**
   - Try a service like Resend or SendGrid
   - They have better debugging tools

</details>

<details>
<summary><strong>Authentication not working</strong></summary>

If sign-up or login fails:

1. **Check the browser console** for error messages

2. **Verify JWT keys exist**
   - Look in `.env.local` for `JWT_PRIVATE_KEY` and `JWKS`
   - If missing, delete them and restart: `npm run dev`

3. **Clear all cookies**
   - Open browser DevTools
   - Application → Cookies → Clear all

4. **Check Convex auth configuration**
   - Open `convex/auth.config.ts`
   - Verify `domain` matches your `NEXT_PUBLIC_DOMAIN`

</details>

<details>
<summary><strong>Type errors after schema changes</strong></summary>

If you get TypeScript errors after changing your database schema:

1. **Restart the Convex dev server**
   ```bash
   # Stop with Ctrl+C, then:
   npx convex dev
   ```

2. **Restart your IDE** (VS Code, etc.)

3. **Clear generated files**
   ```bash
   rm -rf convex/_generated
   npx convex dev
   ```

</details>

---

## FAQ

<details>
<summary><strong>Is this free to use?</strong></summary>

Yes! This template is MIT licensed - use it for personal or commercial projects.

**Free tiers available:**
- Convex: 1GB storage, 1M function calls/month
- Vercel: Unlimited personal projects
- Most SMTP services: 100-3000 emails/month free

</details>

<details>
<summary><strong>Do I need to know React/Next.js?</strong></summary>

Basic React knowledge helps, but you can learn as you go. The template is structured to be beginner-friendly.

**Great resources:**
- [React Tutorial](https://react.dev/learn)
- [Next.js Tutorial](https://nextjs.org/learn)
- [Convex Tutorial](https://docs.convex.dev/tutorial)

</details>

<details>
<summary><strong>Can I use a different database?</strong></summary>

This template is built specifically for Convex. To use PostgreSQL, MongoDB, or others, you'd need to:
- Replace Convex functions with API routes
- Set up your own authentication system
- Handle real-time updates differently

We recommend trying Convex first - it's simpler than traditional databases.

</details>

<details>
<summary><strong>Can I use a different CSS framework?</strong></summary>

Yes! You can replace Tailwind with:
- CSS Modules
- Styled Components
- Sass/SCSS
- Vanilla CSS

Just remove Tailwind from `package.json` and configure your preferred styling solution.

</details>

<details>
<summary><strong>How do I add more OAuth providers?</strong></summary>

Convex Auth supports many providers. Example for Google:

1. **Install the provider**:
   ```bash
   npm install @auth/core
   ```

2. **Add to `convex/auth.ts`**:
   ```typescript
   import Google from "@auth/core/providers/google"

   export const { auth, signIn, signOut } = convexAuth({
     providers: [GitHub, Google, Password({ ... })],
   })
   ```

3. **Add credentials to `.env.local`**:
   ```bash
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   ```

[See full list of providers](https://authjs.dev/getting-started/providers)

</details>

<details>
<summary><strong>How do I add file uploads?</strong></summary>

Convex has built-in file storage:

1. **Add to your mutation**:
   ```typescript
   export const generateUploadUrl = mutation({
     handler: async (ctx) => {
       return await ctx.storage.generateUploadUrl()
     },
   })
   ```

2. **Upload in your component**:
   ```typescript
   const generateUploadUrl = useMutation(api.files.generateUploadUrl)

   async function handleUpload(file: File) {
     const uploadUrl = await generateUploadUrl()
     await fetch(uploadUrl, {
       method: "POST",
       body: file,
     })
   }
   ```

[Full file storage docs](https://docs.convex.dev/file-storage)

</details>

<details>
<summary><strong>Can I use this for mobile apps?</strong></summary>

Yes! Convex works with:
- React Native
- Expo
- iOS (Swift)
- Android (Kotlin)

The backend stays the same. Just change the frontend framework.

[Convex React Native docs](https://docs.convex.dev/client/react/react-native)

</details>

---

## Learn More

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs) - Learn Next.js features and API
- [Convex Docs](https://docs.convex.dev) - Database and backend functions
- [Convex Auth](https://labs.convex.dev/auth) - Authentication system
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework
- [shadcn/ui](https://ui.shadcn.com) - UI component library

### Video Tutorials
- [Convex in 100 Seconds](https://www.youtube.com/watch?v=6-1ZpCqHfFw)
- [Next.js 15 Crash Course](https://www.youtube.com/results?search_query=next+js+15+tutorial)
- [Tailwind CSS Tutorial](https://www.youtube.com/results?search_query=tailwind+css+tutorial)

### Community
- [Convex Discord](https://discord.com/invite/convex) - Get help from the community
- [Next.js Discord](https://discord.gg/nextjs) - Next.js community
- [Stack Overflow](https://stackoverflow.com) - Ask technical questions

---

## Contributing

Found a bug or have a feature suggestion? Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Make your changes
4. Run linting: `npm run lint:fix`
5. Commit your changes: `git commit -m "Add some feature"`
6. Push to the branch: `git push origin my-feature`
7. Open a pull request

---

## License

MIT License - feel free to use this template for any project.

---

## Support

If you find this template helpful, please:
- ⭐ Star this repository
- 🐛 Report bugs by opening an issue
- 💡 Suggest features by opening an issue
- 📖 Improve documentation by submitting a PR

---

**Ready to build something amazing?**

```bash
npm install
npm run dev
```

Happy coding! 🚀
