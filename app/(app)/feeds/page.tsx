import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { MetricCard } from "@/components/metric-card";
import { FeedEmptyState } from "@/components/feeds/feed-empty-state";
import { FeedList } from "@/components/feeds/feed-list";
import { listManagedFeeds } from "@/server/feeds/service";

export const metadata: Metadata = {
  title: "Feeds",
};

export const dynamic = "force-dynamic";

export default async function FeedsPage() {
  const feeds = await listManagedFeeds();
  const activeFeedCount = feeds.filter((feed) => feed.status === "ACTIVE").length;
  const queuedSyncCount = feeds.filter((feed) => feed.nextSyncAt).length;

  return (
    <PageContainer>
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Total feeds"
          value={String(feeds.length)}
          detail="All configured RSS sources."
        />
        <MetricCard
          label="Active feeds"
          value={String(activeFeedCount)}
          detail="Feeds currently active."
        />
        <MetricCard
          label="Next sync slots"
          value={String(queuedSyncCount)}
          detail="Feeds with a scheduled refresh time."
        />
      </section>

      {feeds.length === 0 ? <FeedEmptyState /> : <FeedList feeds={feeds} />}
    </PageContainer>
  );
}
