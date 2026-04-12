import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { MetricCard } from "@/components/metric-card";
import { PageIntro } from "@/components/page-intro";
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
      <PageIntro
        eyebrow="Feed management"
        title="Configure and manage RSS sources"
        description="Add sources, set filters, and choose a refresh cadence."
        actions={
          <Link
            href="/feeds/new"
            className="button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
          >
            Add feed
          </Link>
        }
      />

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
