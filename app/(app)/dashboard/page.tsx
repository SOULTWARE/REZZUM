import type { Metadata } from "next";
import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { FeedStatusBadge, getFeedStatusLabel } from "@/components/feeds/feed-status-badge";
import {
  FeedsIcon,
  QueueIcon,
  ScheduleIcon,
  SparkIcon,
} from "@/components/icons";
import { getRefreshIntervalLabel, joinKeywordList } from "@/lib/feeds/constants";
import { getDashboardOverview } from "@/server/dashboard/overview";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

function formatRelativeDate(value: Date | null) {
  if (!value) {
    return "Not scheduled";
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

function getFeedContext(feed: Awaited<ReturnType<typeof getDashboardOverview>>["feeds"][number]) {
  const keywords = joinKeywordList(feed.filter?.includeKeywords ?? []);

  if (feed.status === "ERROR") {
    return feed.syncError ?? "The last sync attempt needs attention.";
  }

  if (feed.status === "PAUSED") {
    return "Paused while the source strategy is being reviewed.";
  }

  if (keywords) {
    return `Watching for ${keywords}.`;
  }

  return "Broad monitoring mode with no include keywords applied.";
}

export default async function DashboardPage() {
  const overview = await getDashboardOverview();
  const hasFeeds = overview.totalFeeds > 0;

  const overviewCards = [
    {
      label: "Configured feeds",
      value: String(overview.totalFeeds),
      detail: hasFeeds
        ? `${overview.activeFeedCount} active feed${overview.activeFeedCount === 1 ? "" : "s"}`
        : "No RSS sources configured",
      tone: hasFeeds ? "Live" : "Empty",
      icon: FeedsIcon,
    },
    {
      label: "Feeds needing attention",
      value: String(overview.attentionFeedCount),
      detail:
        overview.attentionFeedCount > 0
          ? "Paused or errored feeds need review"
          : "No feed issues right now",
      tone: overview.attentionFeedCount > 0 ? "Review" : "Stable",
      icon: SparkIcon,
    },
    {
      label: "Upcoming sync slots",
      value: String(overview.upcomingSyncCount),
      detail: overview.nextFeedForSync
        ? `${overview.nextFeedForSync.name} is due ${formatRelativeDate(
            overview.nextFeedForSync.nextSyncAt,
          )}`
        : "No syncs scheduled",
      tone: overview.nextFeedForSync ? "Queued" : "Empty",
      icon: ScheduleIcon,
    },
  ];

  return (
    <PageContainer>
      <section className="grid gap-4 md:grid-cols-3">
        {overviewCards.map(({ label, value, detail, tone, icon: Icon }) => (
          <MetricCard
            key={label}
            label={label}
            value={value}
            detail={detail}
            badge={tone}
            icon={<Icon className="h-5 w-5" />}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
        {hasFeeds ? (
          <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Feed health
                </p>
                <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                  Recently configured sources
                </h2>
              </div>
              <Link
                href="/feeds"
                className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:opacity-80"
              >
                Open feed library
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {overview.recentFeeds.map((feed) => (
                <article
                  key={feed.id}
                  className="rounded-[1.25rem] bg-[var(--surface-low)] p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--foreground)]">
                          {feed.name}
                        </h3>
                        <FeedStatusBadge status={feed.status} />
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                        {getFeedContext(feed)}
                      </p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                      {getRefreshIntervalLabel(feed.refreshIntervalMinutes)}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                        Status
                      </p>
                      <p className="mt-2 text-sm text-[var(--foreground)]">
                        {getFeedStatusLabel(feed.status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                        Next sync slot
                      </p>
                      <p className="mt-2 text-sm text-[var(--foreground)]">
                        {formatRelativeDate(feed.nextSyncAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                        Minimum length
                      </p>
                      <p className="mt-2 text-sm text-[var(--foreground)]">
                        {feed.filter?.minimumWordCount ?? 0} words
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <PageEmptyState
            eyebrow="Pipeline overview"
            title="Add a feed to get started"
            description="Feed activity and publishing status will appear here after setup."
            icon={<QueueIcon className="h-6 w-6" />}
            actions={
              <>
                <Link
                  href="/feeds"
                  className="button-primary inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  Add your first feed
                </Link>
                <Link
                  href="/accounts"
                  className="button-secondary inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  Connect accounts
                </Link>
              </>
            }
          />
        )}

        <aside className="surface-card rounded-[1.5rem] p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Overview
          </p>
          <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
            Work areas
          </h2>
          <div className="mt-6 space-y-4 text-sm text-[var(--muted)]">
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="font-semibold text-[var(--foreground)]">1. Configure feeds</p>
              <p className="mt-1 leading-6">
                Add sources, set filters, and manage refresh cadence.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="font-semibold text-[var(--foreground)]">2. Review queue</p>
              <p className="mt-1 leading-6">
                Review drafts, compare platform variants, and make edits.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="font-semibold text-[var(--foreground)]">3. Scheduling</p>
              <p className="mt-1 leading-6">
                Track scheduled, published, and failed posts.
              </p>
            </div>
          </div>
          <Link
            href="/feeds"
            className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:opacity-80"
          >
            Review feed setup
          </Link>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <PageEmptyState
          eyebrow="Review queue"
          title="Open the review queue"
          description="Review drafts, compare platform variants, and keep edits in one place."
          icon={<QueueIcon className="h-6 w-6" />}
          actions={
            <Link
              href="/queue"
              className="button-secondary inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
            >
              Open review queue
            </Link>
          }
        />

        <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Accounts
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                Connect publishing accounts
              </h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Manage LinkedIn and X destinations from the accounts page.
          </p>
          <div className="mt-6 rounded-[1.25rem] bg-[var(--surface-low)] p-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Next step
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
              Connect an account before scheduling or publishing posts.
            </p>
          </div>
        </section>
      </section>
    </PageContainer>
  );
}
