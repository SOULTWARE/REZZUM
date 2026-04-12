import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
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
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Feed management
          </p>
          <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            Configure and manage RSS sources
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Define the sources REZZUM watches, the filters that decide what qualifies,
            and the cadence later sync jobs will use.
          </p>
        </div>

        <Link
          href="/feeds/new"
          className="button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          Add feed
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-card rounded-[1.5rem] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Total feeds
          </p>
          <p className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
            {feeds.length}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            All configured RSS sources in the current workspace.
          </p>
        </article>
        <article className="surface-card rounded-[1.5rem] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Active feeds
          </p>
          <p className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
            {activeFeedCount}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Feeds ready for future sync execution.
          </p>
        </article>
        <article className="surface-card rounded-[1.5rem] p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Next sync slots
          </p>
          <p className="mt-4 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
            {queuedSyncCount}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Scheduled placeholders based on each feed’s refresh interval.
          </p>
        </article>
      </section>

      {feeds.length === 0 ? <FeedEmptyState /> : <FeedList feeds={feeds} />}
    </PageContainer>
  );
}
