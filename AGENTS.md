<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# REZZUM project instructions

## Project
REZZUM is a SaaS application that converts RSS feed articles into AI-generated social media posts and lets users review, edit, schedule, and publish them.

## Product scope
Build the MVP only.

### MVP includes
- RSS feed CRUD
- feed filters
- article ingestion
- article deduplication
- AI draft generation
- review/edit/approve/reject workflow
- scheduling
- publish now
- publishing status tracking
- connected social accounts
- platforms: LinkedIn and X first

### Not in MVP
- advanced analytics
- team collaboration
- Facebook publishing implementation unless explicitly requested later
- billing
- multi-workspace admin complexity
- media asset generation

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- Zod
- background jobs via a queue-friendly architecture

## Coding rules
- Use TypeScript everywhere
- Prefer server components when appropriate
- Use server actions or route handlers consistently
- Validate all external input with Zod
- Keep database access behind reusable server-side services
- No fake placeholder business logic in production paths
- No dead code
- No unnecessary abstractions
- Keep components small and reusable
- Keep pages thin; move logic into lib/server modules
- Use clear loading, empty, and error states
- Preserve strong type safety

## UI rules
- Use the provided UI examples as visual references, not as final literal product naming
- Product name must be REZZUM, not "The Intelligent Feed"
- Keep the UI minimal, clean, and production-grade
- Reuse the patterns from the provided reference screens:
  - landing page
  - feed setup page
  - post preview/editor
  - connected accounts
- Prefer a premium SaaS look:
  - clean spacing
  - restrained color usage
  - clear hierarchy
  - polished empty states
- Do not overdesign dashboards

## Domain rules
- Every generated post must link to:
  - source article
  - platform
  - tone
  - generation metadata
- Publishing must be idempotent
- Publishing must record attempt history
- Scheduled posts must remain editable until published
- Regeneration must preserve prior versions when possible
- Deduplicate articles by canonical URL and/or content hash

## Workflow rules for Codex
Before making major changes:
1. Inspect the repo structure
2. Read docs/PRD.md, docs/ARCHITECTURE.md, docs/TASKS.md, docs/UI_GUIDE.md, docs/UI_EXAMPLES.md
3. Summarize the plan briefly
4. Implement only the requested milestone
5. Run typecheck and lint after changes
6. Report files changed and any follow-up work

## Definition of done
A task is only complete when:
- code compiles
- types pass
- lint passes
- the feature matches the requested scope
- UI matches the intended reference direction
- no obvious TODO placeholders remain unless explicitly allowed
