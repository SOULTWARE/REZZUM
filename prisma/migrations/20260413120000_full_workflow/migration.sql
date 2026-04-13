-- AlterTable
ALTER TABLE "rss_feeds" ADD COLUMN     "auto_publish_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "auto_publish_interval_minutes" INTEGER,
ADD COLUMN     "default_feel" VARCHAR(120),
ADD COLUMN     "default_language" VARCHAR(64),
ADD COLUMN     "generate_linkedin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "generate_x" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "linkedin_account_id" TEXT,
ADD COLUMN     "style_notes" TEXT,
ADD COLUMN     "x_account_id" TEXT;

-- AlterTable
ALTER TABLE "generated_posts" ADD COLUMN     "social_account_id" TEXT;

-- AlterTable
ALTER TABLE "social_accounts" ADD COLUMN     "external_urn" VARCHAR(191),
ADD COLUMN     "metadata_json" JSONB;

-- CreateTable
CREATE TABLE "workspace_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "default_language" VARCHAR(64) NOT NULL DEFAULT 'English',
    "default_feel" VARCHAR(120) NOT NULL DEFAULT 'Professional',
    "default_style" TEXT NOT NULL DEFAULT '',
    "default_auto_publish_interval_minutes" INTEGER,
    "default_linkedin_account_id" TEXT,
    "default_x_account_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "generated_posts_social_account_id_idx" ON "generated_posts"("social_account_id");

-- AddForeignKey
ALTER TABLE "rss_feeds" ADD CONSTRAINT "rss_feeds_linkedin_account_id_fkey" FOREIGN KEY ("linkedin_account_id") REFERENCES "social_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rss_feeds" ADD CONSTRAINT "rss_feeds_x_account_id_fkey" FOREIGN KEY ("x_account_id") REFERENCES "social_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_posts" ADD CONSTRAINT "generated_posts_social_account_id_fkey" FOREIGN KEY ("social_account_id") REFERENCES "social_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_settings" ADD CONSTRAINT "workspace_settings_default_linkedin_account_id_fkey" FOREIGN KEY ("default_linkedin_account_id") REFERENCES "social_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_settings" ADD CONSTRAINT "workspace_settings_default_x_account_id_fkey" FOREIGN KEY ("default_x_account_id") REFERENCES "social_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
