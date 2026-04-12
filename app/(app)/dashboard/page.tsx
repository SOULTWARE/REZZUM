import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { FeedStatusBadge, getFeedStatusLabel } from "@/components/feeds/feed-status-badge";
import {
  AccountsIcon,
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
        ? `${overview.activeFeedCount} active feed${overview.activeFeedCount === 1 ? "" : "s"} ready for future sync jobs`
        : "No RSS sources configured yet",
      tone: hasFeeds ? "Live" : "Empty",
      icon: FeedsIcon,
    },
    {
      label: "Feeds needing attention",
      value: String(overview.attentionFeedCount),
      detail:
        overview.attentionFeedCount > 0
          ? "Paused or errored feeds should be reviewed before sync automation is added"
          : "No feed configuration issues are visible right now",
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
        : "No future sync windows are scheduled yet",
      tone: overview.nextFeedForSync ? "Queued" : "Empty",
      icon: ScheduleIcon,
    },
  ];

  return (
    <PageContainer>
      <section className="grid gap-4 md:grid-cols-3">
        {overviewCards.map(({ label, value, detail, tone, icon: Icon }) => (
          <article
            key={label}
            className="surface-card rounded-[1.25rem] p-5 text-sm text-[var(--muted)]"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-[var(--surface-low)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                {tone}
              </span>
            </div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              {label}
            </p>
            <p className="mt-3 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
              {value}
            </p>
            <p className="mt-2 leading-6">{detail}</p>
          </article>
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
            title="Your publishing pipeline has not started yet"
            description="REZZUM will surface ingested articles, drafted posts, and publishing activity here once feeds and accounts are connected."
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
            Workflow state
          </p>
          <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
            What exists now
          </h2>
          <div className="mt-6 space-y-4 text-sm text-[var(--muted)]">
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="font-semibold text-[var(--foreground)]">1. Configure feeds</p>
              <p className="mt-1 leading-6">
                Feed setup is live with validation, statuses, and refresh cadence.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="font-semibold text-[var(--foreground)]">2. Review queue</p>
              <p className="mt-1 leading-6">
                Draft generation is not connected yet, so the queue remains intentionally empty.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="font-semibold text-[var(--foreground)]">3. Scheduling</p>
              <p className="mt-1 leading-6">
                Publishing windows will remain empty until posts and social accounts exist.
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
          title="No drafts are waiting for approval"
          description="Article ingestion and AI generation are not seeded yet, so REZZUM keeps the review queue intentionally empty until those backend domains exist."
          icon={<QueueIcon className="h-6 w-6" />}
          actions={
            <Link
              href="/feeds"
              className="button-secondary inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
            >
              Inspect feed setup
            </Link>
          }
        />

        <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Publishing readiness
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                Connected publishing is still empty
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--tertiary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]">
              <AccountsIcon className="h-4 w-4" />
              Waiting on accounts
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            This is deliberate: feeds are seeded for demos, but scheduled posts and
            publishing activity stay empty until social accounts, draft generation, and
            publishing services are implemented.
          </p>
          <div className="mt-6 rounded-[1.25rem] bg-[var(--surface-low)] p-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Current placeholder state
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
              Useful for demos: feed health is real, while queue and schedule remain honest
              placeholders instead of fabricated performance metrics.
            </p>
          </div>
        </section>
      </section>
    </PageContainer>
  );
}
