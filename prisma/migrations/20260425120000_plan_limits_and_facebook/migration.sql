-- AlterEnum
ALTER TYPE "SocialPlatform" ADD VALUE IF NOT EXISTS 'FACEBOOK';

-- AlterTable
ALTER TABLE "rss_feeds" ADD COLUMN     "facebook_account_id" TEXT,
ADD COLUMN     "generate_facebook" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "workspace_settings" ADD COLUMN     "default_facebook_account_id" TEXT;

-- AddForeignKey
ALTER TABLE "rss_feeds" ADD CONSTRAINT "rss_feeds_facebook_account_id_fkey" FOREIGN KEY ("facebook_account_id") REFERENCES "social_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_settings" ADD CONSTRAINT "workspace_settings_default_facebook_account_id_fkey" FOREIGN KEY ("default_facebook_account_id") REFERENCES "social_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
