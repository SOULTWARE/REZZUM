# REZZUM

REZZUM is a SaaS app that turns RSS feed articles into AI-generated social media drafts for review, scheduling, and publishing.

## Stack
- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Prisma
- PostgreSQL

## Getting started
1. Copy `.env.example` to `.env`
2. Add your database URL
3. Install dependencies
4. Run Prisma migrations
5. Start the app with `pnpm dev`
6. Set `OPENAI_API_KEY` and optionally override `OPENAI_MODEL` if needed

## Cron setup

### Local development
- `pnpm dev` starts both `next dev` and the cron worker process.
- The cron worker runs the feed-sync and publish-due loops directly every 60 seconds.
- Set `CRON_WORKER_ENABLED=false` if you want to run `next dev` without the worker.
- Use `pnpm dev:next` to run only the Next.js dev server.
- Use `pnpm dev:worker` to run only the cron worker.
- If you access dev through ngrok or another tunnel, set `ALLOWED_DEV_ORIGINS` to a comma-separated list of hostnames, or set `NEXT_PUBLIC_APP_URL` to the tunneled URL, then restart `pnpm dev`.

### Production on Linux or AWS
- Run the web app with `pnpm start`.
- Run the background scheduler with `pnpm cron:worker`.
- Keep the cron worker as a separate long-lived process under `systemd`, `pm2`, Docker, or your process manager of choice.
- The worker only processes feeds or posts that are actually due, so a 60-second loop is safe for the current MVP.

### Optional HTTP cron endpoints
- REZZUM still exposes `GET` and `POST` cron endpoints at `/api/cron/feeds` and `/api/cron/publish`.
- Use those only if you prefer an external scheduler to hit the app over HTTP.
- When using the HTTP endpoints, send `Authorization: Bearer $CRON_SECRET`.

## Important docs
- `AGENTS.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`
- `docs/UI_GUIDE.md`
- `docs/UI_EXAMPLES.md`
