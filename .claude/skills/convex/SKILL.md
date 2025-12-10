---
name: convex
description: >
  Provides comprehensive guidance for Convex backend development including database operations,
  queries, mutations, actions, schemas, authentication, file storage, real-time subscriptions,
  scheduling, HTTP APIs, search, AI agents, and deployment. MUST activate when user asks about:
  backend data operations, Convex functions, database queries, schemas, real-time data, auth setup,
  file uploads, scheduled jobs, HTTP endpoints, or any Convex-specific implementation questions.
  DO NOT activate for frontend UI/styling or general React component questions unrelated to Convex.
allowed-tools: Read, Grep, Glob
---

# Convex Backend Development Skill

## CRITICAL: Activation Protocol

Before proceeding with ANY Convex-related implementation:

1. **EVALUATE**: Is this question about Convex backend, database, functions, or data operations?
2. **ACTIVATE**: If YES, you MUST use this skill for accurate Convex implementation patterns.
3. **COMMIT**: State "ACTIVATING CONVEX SKILL" before proceeding.

## When to Use This Skill

MANDATORY activation for:
- Database queries and mutations
- Schema definitions and validation
- Query, mutation, and action functions
- Real-time data subscriptions
- Authentication setup (Auth.js, Clerk, custom)
- File storage operations
- Scheduled jobs and cron tasks
- HTTP API endpoints
- Full-text search implementation
- AI agent integration
- Convex Components
- Deployment and environment configuration
- Data import/export
- Testing Convex functions
- Performance optimization and indexes
- Any question containing: Convex, query, mutation, action, ctx, db, schema, useQuery, useMutation

DO NOT use for:
- Pure React component styling (use design-guidance skill)
- Frontend routing unrelated to data fetching
- General TypeScript questions without Convex context
- UI/UX design patterns

## Documentation Location

All Convex documentation is located in: `.claude/skills/convex/docs`

Key documentation areas:
- **Database**: `docs/database/` - Reading, writing, schemas, types, pagination
- **Functions**: `docs/functions.mdx` - Queries, mutations, actions
- **Auth**: `docs/auth/` - Authentication patterns and providers
- **File Storage**: `docs/file-storage/` - Upload and manage files
- **Scheduling**: `docs/scheduling/` - Cron jobs and scheduled functions
- **HTTP API**: `docs/http-api/` - External HTTP endpoints
- **Search**: `docs/search/` - Full-text search implementation
- **AI/Agents**: `docs/agents.mdx`, `docs/ai.mdx` - AI integration
- **Components**: `docs/components/` - Reusable Convex components
- **Production**: `docs/production/` - Deployment, hosting, integrations
- **Testing**: `docs/testing/` - Test patterns for Convex functions
- **CLI**: `docs/cli.md` - Command-line interface

## Core Convex Concepts

### Functions (queries, mutations, actions)
- **Queries**: Read-only, real-time reactive, cached
- **Mutations**: Write operations, transactional, consistent
- **Actions**: External integrations, non-transactional, async operations

### Database Operations
- Document-based NoSQL database
- Strong consistency with OCC (Optimistic Concurrency Control)
- Automatic indexes for queries
- Schema validation with TypeScript types

### Real-time Subscriptions
- `useQuery` hook for reactive data
- Automatic cache invalidation
- Optimistic updates with `useMutation`

## Core Principles

1. **Type Safety**: Use generated types from schema with `defineSchema`
2. **Reactive Data**: Prefer queries over actions for data that needs real-time updates
3. **Consistent Writes**: Use mutations for all database writes
4. **Indexes**: Define indexes for efficient query performance
5. **Schema Validation**: Validate all data with `v` validators
6. **Error Handling**: Use ConvexError for user-facing errors
7. **Security**: Implement auth checks in every function that needs protection

## Common Patterns

### Query Pattern
```typescript
export const listItems = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db.query("items")
      .withIndex("by_creation_time")
      .order("desc")
      .take(args.limit ?? 10);
  },
});
```

### Mutation Pattern
```typescript
export const createItem = mutation({
  args: { name: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db.insert("items", {
      name: args.name,
      description: args.description,
      userId: identity.subject,
      createdAt: Date.now(),
    });
  },
});
```

### Action Pattern
```typescript
export const sendEmail = action({
  args: { to: v.string(), subject: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    // Call external API
    await fetch("https://api.email-service.com/send", {
      method: "POST",
      body: JSON.stringify(args),
    });
  },
});
```

## Workflow

1. **Evaluate Question**: Determine if Convex-related
2. **Identify Topic**: Database, auth, functions, file storage, etc.
3. **Search Documentation**: Use Grep to find relevant docs in the topic area
4. **Read Specific Docs**: Read the relevant documentation files
5. **Apply Patterns**: Follow established Convex patterns and best practices
6. **Generate Code**: Provide type-safe, validated, production-ready code

## Progressive Documentation Reading

Only read documentation files when necessary:
- **Level 1**: Answer from common patterns if straightforward
- **Level 2**: Grep for relevant topics in docs folder
- **Level 3**: Read specific documentation files for the topic
- **Level 4**: Read related advanced topics or edge cases

Never read entire documentation at once. Use targeted searches.

## Output Format

Generate code that:
- Uses Convex function builders (`query`, `mutation`, `action`)
- Includes argument validation with `v` validators
- Implements proper authentication checks
- Uses TypeScript with generated types
- Follows Convex naming conventions
- Includes error handling with ConvexError
- Uses proper indexes for queries
- Follows best practices from documentation

## Key File Locations in User Projects

Standard Convex project structure:
- `convex/schema.ts` - Database schema definitions
- `convex/*.ts` - Function definitions (queries, mutations, actions)
- `convex/_generated/api.d.ts` - Generated API types
- `convex.json` - Configuration file
- `.env.local` - Environment variables (CONVEX_URL, etc.)

## Common Tasks

### Schema Definition
Check `docs/database/schemas.mdx` for schema patterns and validation.

### Authentication Setup
Check `docs/auth/` for authentication provider integration.

### File Uploads
Check `docs/file-storage/` for file storage patterns.

### Real-time Search
Check `docs/search/` for full-text search implementation.

### Scheduled Jobs
Check `docs/scheduling/` for cron and scheduled function patterns.

### HTTP Endpoints
Check `docs/http-api/` for external API endpoint creation.

### Testing
Check `docs/testing/` for test patterns and setup.

## Important Notes

- Convex uses its own function definition syntax (not raw async functions)
- Always validate arguments with `v` validators
- Use `ctx.db` for database operations, not direct database access
- Use `ctx.auth` for authentication, not manual token parsing
- Queries are cached and reactive, mutations are not
- Actions can call third-party APIs, queries and mutations cannot
- Use indexes for efficient queries (check query performance in dashboard)
