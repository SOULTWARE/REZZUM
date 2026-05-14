-- CreateIndex
CREATE INDEX "rss_feeds_status_next_sync_at_idx" ON "rss_feeds"("status", "next_sync_at");

-- CreateIndex
CREATE INDEX "generated_posts_status_scheduled_for_idx" ON "generated_posts"("status", "scheduled_for");

-- CreateIndex
CREATE INDEX "generated_posts_status_updated_at_idx" ON "generated_posts"("status", "updated_at");
