import Link from "next/link";
import type { FeedRecord } from "@/server/feeds/repository";
import { FeedStatusBadge } from "@/components/feeds/feed-status-badge";
import { getRefreshIntervalLabel, joinKeywordList } from "@/lib/feeds/constants";

function formatDateTime(value: Date | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatKeywordSummary(feed: FeedRecord) {
  const includeKeywords = joinKeywordList(feed.filter?.includeKeywords ?? []);
  const excludeKeywords = joinKeywordList(feed.filter?.excludeKeywords ?? []);

  return {
    includeKeywords: includeKeywords || "No include keywords",
    excludeKeywords: excludeKeywords || "No exclude keywords",
  };
}

export function FeedList({ feeds }: Readonly<{ feeds: FeedRecord[] }>) {
  return (
    <div className="grid gap-5">
      {feeds.map((feed) => {
        const keywordSummary = formatKeywordSummary(feed);

        return (
          <article key={feed.id} className="surface-card rounded-[1.75rem] p-6 sm:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {feed.name}
                  </h2>
                  <FeedStatusBadge status={feed.status} />
                </div>
                <p className="mt-3 break-all text-sm leading-7 text-[var(--muted)]">
                  {feed.rssUrl}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-[var(--surface-low)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                  {getRefreshIntervalLabel(feed.refreshIntervalMinutes)}
                </div>
                <Link
                  href={`/feeds/${feed.id}/edit`}
                  className="button-secondary inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  Edit feed
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Include keywords
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                  {keywordSummary.includeKeywords}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Exclude keywords
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                  {keywordSummary.excludeKeywords}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Minimum word count
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                  {feed.filter?.minimumWordCount ?? 0} words
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Created
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {formatDateTime(feed.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Updated
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {formatDateTime(feed.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Next sync slot
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {formatDateTime(feed.nextSyncAt)}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
