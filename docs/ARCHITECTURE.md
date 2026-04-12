# REZZUM Architecture

## App architecture
Use a modular Next.js architecture.

## Main modules
- app/
  - route-level UI
- components/
  - reusable UI components
- lib/
  - shared utilities
  - validation
  - formatting
- server/
  - domain services
  - repositories
  - background job orchestration
- prisma/
  - schema and migrations

## Primary domains

### Feeds
Responsible for:
- feed CRUD
- filter config
- sync metadata

### Articles
Responsible for:
- parsed article storage
- normalization
- deduplication
- processing status

### Generation
Responsible for:
- prompt construction
- AI generation requests
- saving generated drafts
- regenerate workflows

### Review
Responsible for:
- editor actions
- approve/reject
- draft versioning
- scheduling handoff

### Publishing
Responsible for:
- publish now
- queued publishing
- idempotency
- retries
- status logging

### Social accounts
Responsible for:
- connected account state
- OAuth/token storage
- platform metadata

## Technical rules

### Validation
- Use Zod for all request and form validation

### Database
- Use Prisma with PostgreSQL
- Use explicit enums where useful for status fields
- Track timestamps on all primary tables

### Background jobs
Jobs should support:
- feed polling
- article processing
- generation
- scheduled publishing
- retries

### Status model
Use explicit statuses, for example:
- article: discovered | filtered_out | ready | processed
- post: draft | approved | rejected | scheduled | published | failed
- account: connected | expired | disconnected | pending

### Idempotency
Publishing logic must avoid duplicate posting by:
- checking post status
- storing provider external ids
- using idempotency guards in publish services

## UI information architecture
- Overview
- Feeds
- Queue
- Editor
- Schedule
- Accounts
- Settings

## Implementation order
1. App shell
2. Database schema
3. Feed management
4. Article ingestion pipeline
5. AI generation
6. Review queue
7. Editor
8. Scheduling
9. Publishing
