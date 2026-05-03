# REZZUM Technical Documentation

This document is the technical reference for running, extending, and operating
REZZUM. The README is intentionally product-focused; implementation details live
here.

## System Overview

REZZUM is a modular Next.js SaaS application that transforms RSS feed articles
into AI-generated social media drafts, keeps a human review step in the middle,
and schedules or publishes the approved copy to connected Facebook, LinkedIn,
and X accounts.

The core pipeline is:

```text
RSS feed -> parsed article -> dedupe/filter -> AI draft -> review -> schedule/publish -> provider attempt log
```

The app has two execution surfaces:

- Web app: Next.js App Router pages, server actions, and route handlers.
- Background worker: long-lived process that polls feeds, ingests articles,
  generates drafts, and publishes due scheduled posts.

HTTP cron endpoints are also available for deployments that prefer an external
scheduler.

## Repository Layout

```text
app/                  Next.js pages, layouts, loading states, and API routes
components/           Reusable UI components for app shell and feature areas
deploy/systemd/       Example production worker service
docs/                 Product, architecture, UI, task, and technical docs
lib/                  Shared constants, validation, auth client, and action types
prisma/               Prisma schema, migrations, config, and seed script
public/               Static assets
scripts/              Dev runner, env loader, and cron worker entrypoints
server/               Domain services, repositories, integrations, and auth
```

## Tech Stack

| Concern | Implementation |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database ORM | Prisma 7 |
| Database | PostgreSQL via `@prisma/adapter-pg` |
| Validation | Zod |
| Auth | Better Auth |
| Email | Nodemailer |
| RSS parsing | Fast XML Parser |
| AI generation | OpenAI Responses API |
| Billing | Polar |
| Social integrations | Facebook Graph API, LinkedIn REST API, X API |

## Main App Areas

| Route | Responsibility |
| --- | --- |
| `/` | Landing page |
| `/dashboard` | Overview of feeds, queue, schedule, and accounts |
| `/feeds` | Feed management and sync status |
| `/feeds/new` | Create a feed |
| `/feeds/[feedId]/edit` | Update feed rules and defaults |
| `/queue` | Review queue with filters |
| `/queue/[postId]` | Draft editor, approval, scheduling, publishing, and regeneration |
| `/schedule` | Scheduled, published, and failed posts timeline |
| `/accounts` | Facebook, LinkedIn, and X account connections |
| `/settings` | Workspace-wide defaults, profile settings, and billing controls |
| `/pricing` | Pricing page |
| `/login` | Authentication entry |
| `/signup` | Account creation entry |
| `/privacy` | Privacy page |
| `/terms` | Terms page |
| `/about` | About page |

## Backend Domains

| Module | Responsibility |
| --- | --- |
| `server/feeds/*` | Feed CRUD, validation, and feed state transitions |
| `server/rss/service.ts` | RSS and Atom fetch and parse logic |
| `server/pipeline/service.ts` | Article ingestion, dedupe, filtering, generation orchestration, and sync scheduling |
| `server/generation/service.ts` | OpenAI prompt construction, model calls, and response handling |
| `server/review-queue/*` | Queue retrieval and draft actions |
| `server/publishing/service.ts` | Publish-now flow, due publish processing, and publish attempts |
| `server/integrations/*` | Facebook, LinkedIn, X OAuth, token handling, and publishing integrations |
| `server/accounts/*` | Connected social account storage and lookup |
| `server/settings/*` | Workspace default settings |
| `server/auth/*` | Better Auth configuration and session helpers |
| `server/security/crypto.ts` | Provider token encryption helpers |
| `server/billing/*` | Plan limits and Polar integration |
| `server/cron/auth.ts` | HTTP cron bearer-token validation |
| `server/db/client.ts` | Prisma client and PostgreSQL adapter setup |

## Product Workflow

1. Connect one or more RSS feeds.
2. Configure feed filters and generation defaults.
3. Let the worker ingest new articles.
4. Generate Facebook, LinkedIn, and X drafts from accepted articles.
5. Review and edit generated drafts in the queue.
6. Approve, reject, schedule, publish now, or regenerate.
7. Track scheduled, published, and failed work in the schedule timeline.

## Data And Status Model

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

Important behavior:

- Publishing should be idempotency-aware.
- Provider external IDs are stored after successful publishing.
- Publish attempts are recorded for observability and retry analysis.
- Scheduled posts remain editable until they are published.
- Article ingestion guards against duplicate canonical URL and content hash races.

## Requirements

- Node.js 20+
- `pnpm`
- PostgreSQL database
- OpenAI API key
- Facebook, LinkedIn, and X developer credentials for real publishing
- SMTP credentials for email verification and verified email changes
- Polar credentials for billing features

## Environment Variables

Copy `.env.example` to `.env` and fill in the values needed for the features
you are running.

| Variable | Required | Purpose |
| --- | --- | --- |
| `POSTGRES_DB` | No | Database name used by the local Docker Postgres service. Default `rezzum`. |
| `POSTGRES_USER` | No | Database user used by the local Docker Postgres service. Default `postgres`. |
| `POSTGRES_PASSWORD` | No | Database password used by the local Docker Postgres service. Default `postgres`. |
| `POSTGRES_PORT` | No | Local host port bound to the Docker Postgres container. Default `5432`. |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma. |
| `OPENAI_API_KEY` | Yes | Required for AI draft generation. |
| `OPENAI_MODEL` | No | Overrides the default generation model. Current default is `gpt-5.4-mini`. |
| `APP_ENCRYPTION_KEY` | Strongly recommended | Stable key for encrypting provider tokens at rest. |
| `BETTER_AUTH_SECRET` | Yes for auth | Secret used to sign Better Auth sessions and OAuth state. Falls back to `APP_ENCRYPTION_KEY` if omitted. |
| `SMTP_HOST` | Required for email verification | SMTP host used to send Better Auth verification emails. |
| `SMTP_PORT` | Required for email verification | SMTP port used to send Better Auth verification emails. |
| `SMTP_SECURE` | No | Set to `true` for implicit TLS, or leave false for STARTTLS/plain SMTP. |
| `SMTP_USER` | No | SMTP username when your provider requires authentication. |
| `SMTP_PASSWORD` | No | SMTP password when your provider requires authentication. |
| `SMTP_FROM` | Required for email verification | Sender used for verification emails, for example `REZZUM <no-reply@example.com>`. |
| `SMTP_CONNECTION_TIMEOUT_MS` | No | SMTP connection timeout in milliseconds. Default `15000`. |
| `SMTP_GREETING_TIMEOUT_MS` | No | SMTP greeting timeout in milliseconds. Default `15000`. |
| `SMTP_SOCKET_TIMEOUT_MS` | No | SMTP socket timeout in milliseconds. Default `30000`. |
| `GOOGLE_CLIENT_ID` | Required for Google sign-in | Google OAuth client ID for Better Auth. |
| `GOOGLE_CLIENT_SECRET` | Required for Google sign-in | Google OAuth client secret for Better Auth. |
| `CRON_SECRET` | Required only for HTTP cron | Bearer secret for `/api/cron/feeds` and `/api/cron/publish`. |
| `CRON_WORKER_ENABLED` | No | Set to `false` to stop `pnpm dev` from starting the worker. |
| `CRON_WORKER_INTERVAL_MS` | No | Worker poll interval in milliseconds. Default `60000`. |
| `CRON_WORKER_STARTUP_DELAY_MS` | No | Delay before the startup tick. Default `5000`. |
| `CRON_WORKER_RUN_ON_STARTUP` | No | Set to `false` to skip the startup tick. |
| `CRON_WORKER_RUN_ONCE` | No | Runs one worker tick and exits. Useful for debugging. |
| `NEXT_PUBLIC_APP_NAME` | No | Public app name shown by auth and UI surfaces. Default `REZZUM`. |
| `NEXT_PUBLIC_APP_URL` | Yes for OAuth and tunnels | Base URL used to generate OAuth callback URLs. |
| `ALLOWED_DEV_ORIGINS` | No | Extra dev origins allowed by Next.js when using ngrok or another tunnel. |
| `FACEBOOK_CLIENT_ID` | Required for Facebook connect | Meta app client ID. |
| `FACEBOOK_CLIENT_SECRET` | Required for Facebook connect | Meta app client secret. |
| `FACEBOOK_API_VERSION` | No | Meta Graph API version. Default `v25.0`. |
| `LINKEDIN_CLIENT_ID` | Required for LinkedIn connect | LinkedIn OAuth client ID. Also enables LinkedIn auth in Better Auth when paired with `LINKEDIN_CLIENT_SECRET`. |
| `LINKEDIN_CLIENT_SECRET` | Required for LinkedIn auth/connect | LinkedIn OAuth client secret. |
| `LINKEDIN_VERSION` | No | LinkedIn REST API version header. Default `202604`. |
| `X_CLIENT_ID` | Required for X connect | X OAuth client ID. |
| `X_CLIENT_SECRET` | Required for X connect | X OAuth client secret. |
| `POLAR_ACCESS_TOKEN` | Required for billing | Polar API token used for subscription lookup, checkout, and customer portal links. |
| `POLAR_PRODUCT_STARTER_ID` | Required for billing | Polar product ID for the Starter plan. |
| `POLAR_PRODUCT_PRO_ID` | Required for billing | Polar product ID for the Pro plan. |
| `POLAR_SERVER` | No | Set to `sandbox` to use Polar sandbox. |

Notes:

- `APP_ENCRYPTION_KEY` should be stable across restarts and deployments. If it
  is omitted, REZZUM derives key material from provider secrets and
  `OPENAI_API_KEY`, which is weaker operationally and can make token decryption
  brittle if secrets change.
- `BETTER_AUTH_SECRET` should be a long random string and should not change
  between deploys unless you intend to invalidate all active sessions.
- Email verification and settings-page email changes are enabled only when the
  SMTP variables above are configured.
- Use `SMTP_SECURE=true` with port `465`, or `SMTP_SECURE=false` with port
  `587`.
- `NEXT_PUBLIC_APP_URL` must match the public URL used by the browser for OAuth
  callbacks.
- `scripts/load-env.ts` loads `.env`, `.env.local`, `.env.<NODE_ENV>`, and
  `.env.<NODE_ENV>.local` for script-based entrypoints.

## Local Development

1. Install dependencies.

```bash
pnpm install
```

2. Copy the example environment file.

```bash
cp .env.example .env
```

3. Start the local database.

```bash
docker compose up -d postgres
```

4. Set the minimum useful local values.

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rezzum?schema=public
OPENAI_API_KEY=your-openai-api-key
BETTER_AUTH_SECRET=replace-with-a-random-32-plus-character-secret
APP_ENCRYPTION_KEY=replace-with-a-stable-random-32-plus-character-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The shipped `.env.example` already points `DATABASE_URL` at the Docker database
on `localhost`.

If you want email verification and verified email-change flows locally, also
set:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_FROM`

If your SMTP provider requires login, also set:

- `SMTP_USER`
- `SMTP_PASSWORD`

5. Sync the database schema.

```bash
pnpm db:push
```

6. Seed workspace defaults.

```bash
pnpm db:seed
```

7. Start development.

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

## Using Ngrok Or Another Tunnel

Next.js 16 blocks cross-origin access to dev assets by default. If you open
REZZUM through a tunnel:

- set `NEXT_PUBLIC_APP_URL` to the tunneled URL
- or add the hostname to `ALLOWED_DEV_ORIGINS`
- restart `pnpm dev`

Example:

```env
NEXT_PUBLIC_APP_URL=https://your-tunnel.example
ALLOWED_DEV_ORIGINS=your-tunnel.example
```

## Database Workflow

This repo uses a local Docker PostgreSQL service for development bootstrap.

Start or restart the database:

```bash
docker compose up -d postgres
```

Stop it:

```bash
docker compose down
```

The database data is stored in the named Docker volume
`rezzum_postgres_data`.

Useful commands:

| Command | Purpose |
| --- | --- |
| `pnpm db:push` | Sync schema to the target database |
| `pnpm db:seed` | Seed the singleton workspace defaults record |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:reset` | Reset the database with Prisma migrate reset |
| `pnpm db:migrate` | Create and apply a migration during development |
| `pnpm db:generate` | Regenerate Prisma client |

## Available Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run Next.js dev server and cron worker together |
| `pnpm dev:next` | Run only the web server |
| `pnpm dev:worker` | Run only the cron worker |
| `pnpm cron:worker` | Run the worker in long-lived mode |
| `pnpm build` | Build the Next.js app |
| `pnpm start` | Start the production web server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript without emit |
| `pnpm prisma:generate` | Regenerate Prisma client |
| `pnpm db:generate` | Alias for Prisma generate |
| `pnpm db:push` | Push schema changes |
| `pnpm db:migrate` | Run Prisma migrate dev |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:seed` | Seed workspace defaults |
| `pnpm db:reset` | Reset the database |

## OAuth And Connected Account Setup

### Facebook

REZZUM connects Facebook accounts and pages through Meta OAuth and publishes
through the Meta Graph API.

Required callback URL:

- `${NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`

Required configuration:

- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`
- `FACEBOOK_API_VERSION` if you need to override the default `v25.0`

### LinkedIn

REZZUM imports LinkedIn organization pages the authenticated member can
administer.

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
- Publishing uses the connected account directly from the review queue and
  scheduler.

## Background Jobs And Cron

REZZUM has two execution models for background work.

### Long-Lived Worker

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

### HTTP Cron Endpoints

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

## Reliability And Behavior Notes

- Feed sync failures distinguish feed-fetch/parse failures from per-article
  generation problems.
- A single article generation failure does not have to fail the whole feed sync.
- Article ingestion is protected against duplicate canonical URL and content
  hash races.
- Publishing is idempotency-aware and records publish attempts.
- Scheduled posts remain editable until they are published.
- Manual feed and queue actions return structured success, warning, and error
  toasts.

## Related Documentation

- [README](../README.md)
- [PRD](PRD.md)
- [Architecture](ARCHITECTURE.md)
- [Tasks](TASKS.md)
- [UI Guide](UI_GUIDE.md)
