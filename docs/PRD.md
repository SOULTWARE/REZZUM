# REZZUM PRD

## Product summary
REZZUM transforms RSS feed content into platform-specific AI-generated social media posts with human review control before publishing.

## Core principle
REZZUM is not just a scheduler.
It is a content transformation pipeline from RSS feed -> filtered article -> AI draft -> review -> scheduling/publishing.

## Target user
Initial MVP target:
- solo operators
- founders
- creators
- agencies
- niche publishers

## MVP workflow

### 1. RSS feed setup
Users can:
- add RSS feed URLs
- name each feed
- configure filters:
  - include keywords
  - exclude keywords
  - minimum content length

System behavior:
- periodically fetch feed entries
- normalize entries
- deduplicate articles
- only process entries that pass filters

### 2. AI generation
For each qualifying article, the system generates social posts per platform.

Inputs:
- article title
- article content
- selected platform
- tone
- platform constraints

Outputs:
- LinkedIn draft
- X draft

### 3. Storage
Generated drafts are stored with:
- source article
- target platform
- generation metadata
- prompt version
- status

### 4. Review and editing
Users can:
- preview drafts
- edit drafts
- regenerate drafts
- approve or reject drafts

### 5. Scheduling and publishing
Users can:
- publish immediately
- schedule for later

System tracks:
- pending
- scheduled
- published
- failed

### 6. Connected accounts
Users connect accounts for:
- LinkedIn
- X

## MVP success criteria
- user can add a feed
- system ingests articles
- user sees generated drafts
- user edits/approves a draft
- user schedules or publishes the draft
- publishing status is visible in the UI

## Excluded from MVP
- advanced analytics
- team roles
- approval chains
- billing
- multi-brand orchestration
- rich media generation
