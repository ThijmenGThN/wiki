# Quick Start Guide

Import your wiki data into Convex in 3 simple steps:

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Convex URL

```bash
cp .env.example .env
```

Then edit `.env` and set your Convex URL:
- **Local development**: `CONVEX_URL=http://127.0.0.1:3210`
- **Production**: `CONVEX_URL=https://your-deployment.convex.cloud`

## 3. Run the Import

```bash
npm run import
```

That's it! Your wiki data is now imported.

## Verify the Import

```bash
npm run verify
```

## Need Help?

See [README.md](./README.md) for detailed documentation and troubleshooting.

## Additional Options

```bash
# Preview what will be imported (no changes made)
npm run import:dry-run

# Clear existing data and re-import
npm run import:clear
```
