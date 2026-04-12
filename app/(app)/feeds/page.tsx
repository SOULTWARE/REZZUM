import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { FeedEmptyState } from "@/components/feeds/feed-empty-state";
import { FeedList } from "@/components/feeds/feed-list";
import { FeedsIcon, ScheduleIcon, SparkIcon } from "@/components/icons";
import { listManagedFeeds } from "@/server/feeds/service";

export const metadata: Metadata = {
  title: "Feeds",
};

export const dynamic = "force-dynamic";

function formatRelativeDate(value: Date | null) {
  if (!value) {
    return "No sync queued";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMinutes = Math.round((value.getTime() - Date.now()) / 60_000);

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  return formatter.format(Math.round(diffHours / 24), "day");
}

function formatPercentage(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export default async function FeedsPage() {
  const feeds = await listManagedFeeds();
  const activeFeedCount = feeds.filter((feed) => feed.status === "ACTIVE").length;
  const attentionFeedCount = feeds.filter(
    (feed) => feed.status === "ERROR" || feed.status === "PAUSED",
  ).length;
  const queuedSyncCount = feeds.filter((feed) => feed.nextSyncAt).length;
  const nextFeedForSync =
    feeds
      .filter((feed) => feed.nextSyncAt)
      .sort((left, right) => {
        if (!left.nextSyncAt || !right.nextSyncAt) {
          return 0;
        }

        return left.nextSyncAt.getTime() - right.nextSyncAt.getTime();
      })[0] ?? null;
  const activeRate = formatPercentage(activeFeedCount, feeds.length);
  const queuedRate = formatPercentage(queuedSyncCount, feeds.length);

  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-12">
        <article className="rounded-xl bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--primary)]">
              <FeedsIcon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[var(--surface-low)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Library
            </span>
          </div>
          <p className="font-[var(--font-display)] text-3xl font-bold text-slate-900">
            {feeds.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Configured feeds</p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            {activeFeedCount} active source{activeFeedCount === 1 ? "" : "s"} are currently ready
            to poll and process new articles.
          </p>
        </article>

        <article className="rounded-xl bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--primary)]">
              <ScheduleIcon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[rgb(223_213_247_/_0.5)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgb(79_73_100)]">
              Sync
            </span>
          </div>
          <p className="font-[var(--font-display)] text-3xl font-bold text-slate-900">
            {queuedSyncCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">Queued sync slots</p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            {nextFeedForSync
              ? `${nextFeedForSync.name} is due ${formatRelativeDate(nextFeedForSync.nextSyncAt)}.`
              : "No feeds currently have an upcoming sync scheduled."}
          </p>
        </article>

        <article className="relative overflow-hidden rounded-xl bg-[linear-gradient(145deg,_#0053da_0%,_#0048c1_100%)] p-6 text-white shadow-sm xl:col-span-6">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">
              Signal coverage
            </p>
            <p className="mt-2 font-[var(--font-display)] text-4xl font-bold tracking-[-0.04em]">
              {activeFeedCount} sources monitoring
            </p>
            <div className="mt-5 flex flex-wrap gap-6">
              <div className="min-w-[96px]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Attention
                </p>
                <p className="mt-1 text-lg font-bold">{attentionFeedCount}</p>
              </div>
              <div className="min-w-[96px]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Active rate
                </p>
                <p className="mt-1 text-lg font-bold">{activeRate}%</p>
              </div>
              <div className="min-w-[96px]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Sync coverage
                </p>
                <p className="mt-1 text-lg font-bold">{queuedRate}%</p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-5 -top-6 text-white/10">
            <SparkIcon className="h-44 w-44" />
          </div>
        </article>
      </section>

      <section>{feeds.length === 0 ? <FeedEmptyState /> : <FeedList feeds={feeds} />}</section>
    </PageContainer>
  );
}
