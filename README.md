# REZZUM

REZZUM is a Next.js SaaS app that turns RSS feed articles into AI-generated social media drafts, keeps a human review step in the middle, and then schedules or publishes the final copy to connected LinkedIn and X accounts.

## What REZZUM does

- Stores RSS feeds with per-feed filtering, generation, and publishing defaults.
- Fetches and parses RSS and Atom feeds on a polling loop.
- Deduplicates articles by source URL, canonical URL, and content hash.
- Generates platform-aware drafts with OpenAI for LinkedIn and X.
- Preserves article context, generation model, prompt version, tone, and destination account on each draft.
- Supports review, edit, approve, reject, regenerate, schedule, and publish-now flows.
- Tracks publishing state and keeps publish attempt history.
- Runs feed syncing and due-post publishing from a background cron worker.

## MVP scope

Included:

- Feed CRUD
- Feed filters
- Article ingestion
- Article deduplication
- AI draft generation
- Review queue and draft editor
- Scheduling
- Publish now
- Publishing status tracking
- Connected LinkedIn and X accounts
- Workspace defaults for generation and destinations

Not included:

- Billing
- Team collaboration
- Advanced analytics
- Rich media generation
- Facebook publishing
- Multi-workspace admin complexity

## Main app areas

- `/` landing page
- `/dashboard` overview of feeds, queue, schedule, and accounts
- `/feeds` feed management and sync status
- `/feeds/new` create a feed
- `/feeds/[feedId]/edit` update feed rules and defaults
- `/queue` review queue with filters
- `/queue/[postId]` draft editor, approval, scheduling, publish, and regeneration
- `/schedule` scheduled, published, and failed posts timeline
- `/accounts` LinkedIn and X account connections
- `/settings` workspace-wide generation and destination defaults

## Architecture

REZZUM follows a modular App Router structure:

- `app/`
  Route-level UI, API routes, and layouts.
- `components/`
  Reusable presentation components for feeds, queue, schedule, accounts, layout, and toasts.
- `lib/`
  Shared constants, validation, and client-side action types.
- `server/`
  Domain services, repositories, integrations, cron auth, and orchestration logic.
- `prisma/`
  Prisma schema, config, and seed script.
- `scripts/`
  Development runner, environment loading, and cron worker entrypoints.
- `docs/`
  PRD, architecture, tasks, UI guide, and UI references.
- `reference-ui/`
  Visual reference assets used as design direction.

## Core backend domains

- `server/feeds/*`
  Feed CRUD and feed state transitions.
- `server/rss/service.ts`
  RSS and Atom fetch + parse.
- `server/pipeline/service.ts`
  Article ingestion, dedupe, filtering, generation orchestration, and sync scheduling.
- `server/generation/service.ts`
  OpenAI prompt construction and response handling.
- `server/review-queue/*`
  Review queue retrieval and draft actions.
- `server/publishing/service.ts`
  Publish-now flow, due publish processing, and publish attempts.
- `server/integrations/*`
  LinkedIn and X OAuth + publishing integrations.
- `server/accounts/*`
  Connected social account storage and lookup.
- `server/settings/*`
  Workspace default settings.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7
- PostgreSQL via `@prisma/adapter-pg`
- Zod
- Fast XML Parser
- OpenAI Responses API

## Requirements

- Node.js 20+
- `pnpm`
- PostgreSQL database
- OpenAI API key
- LinkedIn and X developer credentials if you want real publishing integrations

## Environment variables

Copy `.env.example` to `.env` and fill in the values you need.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma. |
| `OPENAI_API_KEY` | Yes | Required for AI draft generation. |
| `OPENAI_MODEL` | No | Overrides the default model. Current default is `gpt-5.4-mini`. |
| `APP_ENCRYPTION_KEY` | Strongly recommended | Stable key for encrypting provider tokens at rest. |
| `CRON_SECRET` | Required only for HTTP cron | Bearer secret for `/api/cron/feeds` and `/api/cron/publish`. |
| `CRON_WORKER_ENABLED` | No | Set to `false` to stop `pnpm dev` from starting the worker. |
| `CRON_WORKER_INTERVAL_MS` | No | Worker poll interval in milliseconds. Default `60000`. |
| `CRON_WORKER_STARTUP_DELAY_MS` | No | Delay before the startup tick. Default `5000`. |
| `CRON_WORKER_RUN_ON_STARTUP` | No | Set to `false` to skip the startup tick. |
| `CRON_WORKER_RUN_ONCE` | No | Runs one worker tick and exits. Useful for debugging. |
| `NEXT_PUBLIC_APP_URL` | Yes for OAuth and tunnels | Base URL used to generate OAuth callback URLs. |
| `ALLOWED_DEV_ORIGINS` | No | Extra dev origins allowed by Next.js when using ngrok or another tunnel. |
| `LINKEDIN_CLIENT_ID` | Required for LinkedIn connect | LinkedIn OAuth client ID. |
| `LINKEDIN_CLIENT_SECRET` | Required for LinkedIn connect | LinkedIn OAuth client secret. |
| `LINKEDIN_VERSION` | No | LinkedIn REST API version header. Default `202604`. |
| `X_CLIENT_ID` | Required for X connect | X OAuth client ID. |
| `X_CLIENT_SECRET` | Required for X connect | X OAuth client secret. |

Notes:

- `APP_ENCRYPTION_KEY` should be stable across restarts and deployments. If you do not set it, REZZUM derives key material from provider secrets and `OPENAI_API_KEY`, which is weaker operationally and can make token decryption brittle if secrets change.
- `NEXT_PUBLIC_APP_URL` must match the public URL used by the browser for OAuth callbacks.
- `scripts/load-env.ts` loads `.env`, `.env.local`, `.env.<NODE_ENV>`, and `.env.<NODE_ENV>.local` for script-based entrypoints.

## Local development

1. Install dependencies.

```bash
pnpm install
```

2. Copy the example environment file.

```bash
cp .env.example .env
```

3. Set at minimum:

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`
- `APP_ENCRYPTION_KEY`

4. Sync the database schema.

```bash
pnpm db:push
```

5. Seed workspace defaults.

```bash
pnpm db:seed
```

6. Start development.

```bash
pnpm dev
```

`pnpm dev` starts both:

- the Next.js dev server
- the cron worker polling loop

If you only want the web server:

```bash
pnpm dev:next
```

If you only want the worker:

```bash
pnpm dev:worker
```

### Using ngrok or another tunnel

Next.js 16 blocks cross-origin access to dev assets by default. If you open REZZUM through a tunnel:

- set `NEXT_PUBLIC_APP_URL` to the tunneled URL
- or add the hostname to `ALLOWED_DEV_ORIGINS`
- restart `pnpm dev`

Example:

```env
NEXT_PUBLIC_APP_URL=https://your-tunnel.example
ALLOWED_DEV_ORIGINS=your-tunnel.example
```

## Database workflow

This repo currently works best with schema sync for local bootstrap.

Useful commands:

- `pnpm db:push` sync schema to the target database
- `pnpm db:seed` seed the singleton workspace defaults record
- `pnpm db:studio` open Prisma Studio
- `pnpm db:reset` reset the database with Prisma migrate reset
- `pnpm db:migrate` create and apply a migration during development if you choose a migration-first workflow

## Available scripts

- `pnpm dev` run Next.js dev server and cron worker together
- `pnpm dev:next` run only the web server
- `pnpm dev:worker` run only the cron worker
- `pnpm cron:worker` run the worker in long-lived mode
- `pnpm build` build the Next.js app
- `pnpm start` start the production web server
- `pnpm lint` run ESLint
- `pnpm typecheck` run TypeScript without emit
- `pnpm prisma:generate` regenerate Prisma client
- `pnpm db:generate` alias for Prisma generate
- `pnpm db:push` push schema changes
- `pnpm db:migrate` run Prisma migrate dev
- `pnpm db:studio` open Prisma Studio
- `pnpm db:seed` seed workspace defaults
- `pnpm db:reset` reset the database

## OAuth and connected account setup

### LinkedIn

REZZUM imports LinkedIn organization pages the authenticated member can administer.

Required callback URL:

- `${NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`

Important behavior:

- LinkedIn requires organization scopes.
- The connected user must be an admin of the LinkedIn page.
- REZZUM stores imported organization pages as publishable social accounts.

### X

REZZUM uses OAuth 2.0 PKCE for X.

Required callback URL:

- `${NEXT_PUBLIC_APP_URL}/api/auth/x/callback`

Important behavior:

- X account connection stores encrypted access and refresh tokens.
- Publishing uses the connected account directly from the review queue and scheduler.

## Background jobs and cron

REZZUM has two execution models for background work.

### 1. Long-lived worker

Preferred for local development and most server deployments.

```bash
pnpm cron:worker
```

The worker:

- polls due feeds
- ingests articles
- generates drafts
- publishes due scheduled posts

Example systemd unit:

- `deploy/systemd/rezzum-cron-worker.service`

### 2. HTTP cron endpoints

Available endpoints:

- `GET /api/cron/feeds`
- `POST /api/cron/feeds`
- `GET /api/cron/publish`
- `POST /api/cron/publish`

These require:

```http
Authorization: Bearer <CRON_SECRET>
```

Use HTTP cron only if you prefer an external scheduler over a long-lived worker.

## Product workflow

1. Connect one or more RSS feeds.
2. Configure filters and generation defaults.
3. Let the worker ingest new articles.
4. Generate LinkedIn and X drafts from accepted articles.
5. Review and edit drafts in the queue.
6. Approve, reject, schedule, publish now, or regenerate.
7. Track the result in the schedule and publishing timeline.

## Status model

Feed statuses:

- `ACTIVE`
- `PAUSED`
- `ERROR`
- `ARCHIVED`

Article statuses:

- `DISCOVERED`
- `FILTERED_OUT`
- `READY`
- `PROCESSED`

Post statuses:

- `DRAFT`
- `APPROVED`
- `REJECTED`
- `SCHEDULED`
- `PUBLISHED`
- `FAILED`

## Reliability and behavior notes

- Feed sync failures now distinguish feed-fetch/parse failures from per-article generation problems.
- A single article generation failure does not have to poison the whole feed sync.
- Article ingestion is protected against duplicate canonical URL and content hash races.
- Publishing is idempotency-aware and records publish attempts.
- Scheduled posts remain editable until they are published.
- Manual feed and queue actions return structured success, warning, and error toasts.

## Repository layout

```text
app/                  Next.js pages, layouts, and API routes
components/           UI components
deploy/systemd/       Example production worker service
docs/                 Product and architecture docs
lib/                  Shared constants, validation, and action types
prisma/               Prisma schema, config, and seed
reference-ui/         Design reference assets
scripts/              Dev runner and cron worker entrypoints
server/               Domain services, repositories, and integrations
```

## Related documentation

- `AGENTS.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`
- `docs/UI_GUIDE.md`
- `docs/UI_EXAMPLES.md`
- `reference-ui/README.md`

## Current limitations

- MVP scope only
- LinkedIn and X first
- No billing, analytics, media generation, or team workflows
- No queue system yet beyond the current polling-worker architecture

