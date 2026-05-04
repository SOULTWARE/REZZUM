<div align="center">
  <img src="./public/logo-256.png?raw=true" alt="REZZUM logo" width="112" height="112" />
  <h1>REZZUM</h1>
  <p><strong>Turn RSS feeds into reviewed, scheduled social posts.</strong></p>
  <p>
    REZZUM is a Next.js SaaS app for transforming fresh articles into
    platform-aware drafts, keeping humans in control before anything reaches
    Facebook, LinkedIn, or X.
  </p>
</div>

---

## Product Snapshot

| Signal | Detail |
| --- | --- |
| Core workflow | RSS article -> AI draft -> review -> schedule or publish |
| Primary users | Solo operators, founders, creators, agencies, and niche publishers |
| Review model | Drafts stay editable until approval, scheduling, or publishing |
| Publishing targets | Facebook, LinkedIn, and X connected accounts |
| Runtime | Next.js web app plus a cron worker for ingestion and publishing |

## What REZZUM Does

- Connects RSS and Atom feeds with per-feed filters and publishing defaults.
- Deduplicates articles by source URL, canonical URL, and content hash.
- Generates platform-specific drafts with source context and prompt metadata.
- Supports edit, regenerate, approve, reject, schedule, and publish-now flows.
- Tracks publishing state and stores provider attempt history.
- Runs feed syncing and due-post publishing from a background worker or HTTP cron.

## App Experience

| Area | Purpose |
| --- | --- |
| `/dashboard` | Operational overview across feeds, queue, schedule, and accounts |
| `/feeds` | Feed management, sync status, filters, and generation defaults |
| `/queue` | Review queue for generated social drafts |
| `/queue/[postId]` | Draft editor with source context, actions, and regeneration |
| `/schedule` | Scheduled, published, and failed post timeline |
| `/accounts` | Facebook, LinkedIn, and X account connections |
| `/settings` | Workspace defaults, account settings, and billing controls |

## Tech Stack

| Layer | Tools |
| --- | --- |
| Web | Next.js 16 App Router, React 19, TypeScript |
| UI | Tailwind CSS 4, lucide-react |
| Data | PostgreSQL, Prisma 7, `@prisma/adapter-pg` |
| Validation | Zod |
| Auth | Better Auth |
| Content | Fast XML Parser, OpenAI Responses API |
| Billing | Polar |

## Quick Start

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm db:push
pnpm db:seed
pnpm dev
```

`pnpm dev` starts the Next.js dev server and the local cron worker together.

Minimum environment values for a useful local run:

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `BETTER_AUTH_SECRET`
- `APP_ENCRYPTION_KEY`
- `NEXT_PUBLIC_APP_URL`

For the full environment matrix, OAuth callback setup, database workflow, cron
options, and operational notes, read [docs/TECHNICAL.md](docs/TECHNICAL.md).

## Documentation

| Document | Use it for |
| --- | --- |
| [Technical documentation](docs/TECHNICAL.md) | Architecture, setup, env vars, cron, OAuth, scripts, and reliability notes |
| [Product requirements](docs/PRD.md) | MVP scope, target users, and product workflow |
| [Architecture notes](docs/ARCHITECTURE.md) | High-level module boundaries and implementation order |
| [Task list](docs/TASKS.md) | Remaining milestone checklist |
| [UI guide](docs/UI_GUIDE.md) | Visual direction and UX priorities |

## Current Scope

Included in the MVP:

- Feed CRUD, filters, ingestion, and deduplication
- AI draft generation and regeneration
- Review queue and draft editor
- Scheduling and publish-now flows
- Publishing status and attempt tracking
- Facebook, LinkedIn, and X connected accounts
- Workspace generation and destination defaults

Not included yet:

- Team collaboration
- Advanced analytics
- Rich media generation
- Multi-workspace admin complexity
- Dedicated queue infrastructure beyond the polling worker
