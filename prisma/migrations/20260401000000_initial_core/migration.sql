-- CreateEnum
CREATE TYPE "FeedStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ERROR', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DISCOVERED', 'FILTERED_OUT', 'READY', 'PROCESSED');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('FACEBOOK', 'LINKEDIN', 'X');

-- CreateEnum
CREATE TYPE "GenerationTone" AS ENUM ('PROFESSIONAL', 'BOLD', 'EDUCATIONAL');

-- CreateEnum
CREATE TYPE "GeneratedPostStatus" AS ENUM ('DRAFT', 'APPROVED', 'REJECTED', 'SCHEDULED', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "SocialAccountStatus" AS ENUM ('CONNECTED', 'PENDING', 'EXPIRED', 'DISCONNECTED');

-- CreateEnum
CREATE TYPE "PublishAttemptStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "rss_feeds" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "rss_url" TEXT NOT NULL,
    "normalized_rss_url" TEXT NOT NULL,
    "status" "FeedStatus" NOT NULL DEFAULT 'ACTIVE',
    "refresh_interval_minutes" INTEGER NOT NULL,
    "last_synced_at" TIMESTAMP(3),
    "last_sync_attempt_at" TIMESTAMP(3),
    "next_sync_at" TIMESTAMP(3),
    "sync_error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "archived_at" TIMESTAMP(3),

    CONSTRAINT "rss_feeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_filters" (
    "id" TEXT NOT NULL,
    "feed_id" TEXT NOT NULL,
    "include_keywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "exclude_keywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "minimum_word_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feed_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "feed_id" TEXT NOT NULL,
    "source_entry_id" VARCHAR(255),
    "title" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "canonical_url" TEXT,
    "content_hash" VARCHAR(64),
    "excerpt" TEXT,
    "content_text" TEXT,
    "author_name" VARCHAR(191),
    "published_at" TIMESTAMP(3),
    "discovered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DISCOVERED',
    "filtered_out_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_accounts" (
    "id" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "status" "SocialAccountStatus" NOT NULL DEFAULT 'PENDING',
    "display_name" VARCHAR(191) NOT NULL,
    "handle" VARCHAR(191),
    "profile_url" TEXT,
    "provider_account_id" VARCHAR(191),
    "provider_username" VARCHAR(191),
    "access_token_encrypted" TEXT,
    "refresh_token_encrypted" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "scopes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "last_validated_at" TIMESTAMP(3),
    "connected_at" TIMESTAMP(3),
    "disconnected_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_posts" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "tone" "GenerationTone" NOT NULL,
    "status" "GeneratedPostStatus" NOT NULL DEFAULT 'DRAFT',
    "prompt_version" VARCHAR(64) NOT NULL,
    "generation_model" VARCHAR(128),
    "generated_text" TEXT NOT NULL,
    "edited_text" TEXT,
    "generation_started_at" TIMESTAMP(3),
    "generated_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "scheduled_for" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "published_external_id" VARCHAR(191),
    "previous_version_id" TEXT,
    "version_number" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publish_attempts" (
    "id" TEXT NOT NULL,
    "generated_post_id" TEXT NOT NULL,
    "status" "PublishAttemptStatus" NOT NULL DEFAULT 'PENDING',
    "idempotency_key" VARCHAR(191) NOT NULL,
    "attempted_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "provider_status_code" VARCHAR(64),
    "provider_message" TEXT,
    "published_external_id" VARCHAR(191),
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publish_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rss_feeds_normalized_rss_url_key" ON "rss_feeds"("normalized_rss_url");

-- CreateIndex
CREATE INDEX "rss_feeds_status_idx" ON "rss_feeds"("status");

-- CreateIndex
CREATE INDEX "rss_feeds_next_sync_at_idx" ON "rss_feeds"("next_sync_at");

-- CreateIndex
CREATE UNIQUE INDEX "feed_filters_feed_id_key" ON "feed_filters"("feed_id");

-- CreateIndex
CREATE UNIQUE INDEX "articles_canonical_url_key" ON "articles"("canonical_url");

-- CreateIndex
CREATE UNIQUE INDEX "articles_content_hash_key" ON "articles"("content_hash");

-- CreateIndex
CREATE UNIQUE INDEX "articles_feed_id_source_url_key" ON "articles"("feed_id", "source_url");

-- CreateIndex
CREATE INDEX "articles_feed_id_status_idx" ON "articles"("feed_id", "status");

-- CreateIndex
CREATE INDEX "articles_published_at_idx" ON "articles"("published_at");

-- CreateIndex
CREATE INDEX "articles_discovered_at_idx" ON "articles"("discovered_at");

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_platform_provider_account_id_key" ON "social_accounts"("platform", "provider_account_id");

-- CreateIndex
CREATE INDEX "social_accounts_platform_status_idx" ON "social_accounts"("platform", "status");

-- CreateIndex
CREATE INDEX "social_accounts_status_idx" ON "social_accounts"("status");

-- CreateIndex
CREATE INDEX "generated_posts_article_id_platform_idx" ON "generated_posts"("article_id", "platform");

-- CreateIndex
CREATE INDEX "generated_posts_status_idx" ON "generated_posts"("status");

-- CreateIndex
CREATE INDEX "generated_posts_scheduled_for_idx" ON "generated_posts"("scheduled_for");

-- CreateIndex
CREATE INDEX "generated_posts_published_at_idx" ON "generated_posts"("published_at");

-- CreateIndex
CREATE INDEX "generated_posts_published_external_id_idx" ON "generated_posts"("published_external_id");

-- CreateIndex
CREATE UNIQUE INDEX "publish_attempts_idempotency_key_key" ON "publish_attempts"("idempotency_key");

-- CreateIndex
CREATE INDEX "publish_attempts_generated_post_id_created_at_idx" ON "publish_attempts"("generated_post_id", "created_at");

-- CreateIndex
CREATE INDEX "publish_attempts_status_idx" ON "publish_attempts"("status");

-- AddForeignKey
ALTER TABLE "feed_filters" ADD CONSTRAINT "feed_filters_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "rss_feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "rss_feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_posts" ADD CONSTRAINT "generated_posts_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_posts" ADD CONSTRAINT "generated_posts_previous_version_id_fkey" FOREIGN KEY ("previous_version_id") REFERENCES "generated_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publish_attempts" ADD CONSTRAINT "publish_attempts_generated_post_id_fkey" FOREIGN KEY ("generated_post_id") REFERENCES "generated_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
