-- AlterEnum
ALTER TYPE "GeneratedPostStatus" ADD VALUE IF NOT EXISTS 'PUBLISHING';

-- AlterTable
ALTER TABLE "rss_feeds" ADD COLUMN "user_id" TEXT;

-- AlterTable
ALTER TABLE "social_accounts" ADD COLUMN "user_id" TEXT;

-- AlterTable
ALTER TABLE "workspace_settings" ADD COLUMN "user_id" TEXT;

-- Assign pre-existing single-workspace records to the first registered user.
WITH first_user AS (
  SELECT "id"
  FROM "user"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
UPDATE "rss_feeds"
SET "user_id" = first_user."id"
FROM first_user
WHERE "rss_feeds"."user_id" IS NULL;

WITH first_user AS (
  SELECT "id"
  FROM "user"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
UPDATE "social_accounts"
SET "user_id" = first_user."id"
FROM first_user
WHERE "social_accounts"."user_id" IS NULL;

WITH first_user AS (
  SELECT "id"
  FROM "user"
  ORDER BY "createdAt" ASC
  LIMIT 1
)
UPDATE "workspace_settings"
SET "user_id" = first_user."id"
FROM first_user
WHERE "workspace_settings"."user_id" IS NULL;

-- Rows without a user cannot be safely exposed after tenant scoping.
DELETE FROM "rss_feeds" WHERE "user_id" IS NULL;
DELETE FROM "social_accounts" WHERE "user_id" IS NULL;
DELETE FROM "workspace_settings" WHERE "user_id" IS NULL;

-- AlterColumn
ALTER TABLE "rss_feeds" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "social_accounts" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "workspace_settings" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "workspace_settings" ALTER COLUMN "id" DROP DEFAULT;

-- Drop old global uniqueness.
DROP INDEX IF EXISTS "rss_feeds_normalized_rss_url_key";
DROP INDEX IF EXISTS "articles_canonical_url_key";
DROP INDEX IF EXISTS "articles_content_hash_key";
DROP INDEX IF EXISTS "social_accounts_platform_provider_account_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "rss_feeds_user_id_normalized_rss_url_key" ON "rss_feeds"("user_id", "normalized_rss_url");

-- CreateIndex
CREATE UNIQUE INDEX "rss_feeds_id_user_id_key" ON "rss_feeds"("id", "user_id");

-- CreateIndex
CREATE INDEX "rss_feeds_user_id_status_idx" ON "rss_feeds"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "articles_feed_id_canonical_url_key" ON "articles"("feed_id", "canonical_url");

-- CreateIndex
CREATE UNIQUE INDEX "articles_feed_id_content_hash_key" ON "articles"("feed_id", "content_hash");

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_user_id_platform_provider_account_id_key" ON "social_accounts"("user_id", "platform", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_id_user_id_key" ON "social_accounts"("id", "user_id");

-- CreateIndex
CREATE INDEX "social_accounts_user_id_platform_status_idx" ON "social_accounts"("user_id", "platform", "status");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_settings_user_id_key" ON "workspace_settings"("user_id");

-- AddForeignKey
ALTER TABLE "rss_feeds" ADD CONSTRAINT "rss_feeds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_settings" ADD CONSTRAINT "workspace_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
