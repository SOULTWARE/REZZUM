import type { Metadata } from "next";
import { GeneratedPostStatus } from "@prisma/client";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import {
  AccountsIcon,
  FeedsIcon,
  QueueIcon,
  ReviewIcon,
  ScheduleIcon,
  SparkIcon,
} from "@/components/icons";
import { getGeneratedPostStatusLabel, getSocialPlatformLabel } from "@/lib/review-queue/constants";
import { requireAuthSession } from "@/server/auth/session";
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

function formatFeedTime(value: Date | null) {
  if (!value) {
    return "No upcoming sync";
  }

  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return formatter.format(value);
}

function formatActivityTime(value: Date | null) {
  if (!value) {
    return "No recent activity";
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

function getSourceAvatarTone(name: string) {
  const tones = [
    "bg-slate-200 text-slate-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
  ] as const;

  return tones[name.length % tones.length];
}

function getStatusClassName(status: GeneratedPostStatus) {
  if (status === GeneratedPostStatus.PUBLISHED) {
    return "bg-[var(--primary-soft)] text-[var(--primary-strong)]";
  }

  if (status === GeneratedPostStatus.SCHEDULED) {
    return "bg-[var(--tertiary-soft)] text-[rgb(79_73_100)]";
  }

  if (status === GeneratedPostStatus.PUBLISHING) {
    return "bg-[var(--primary-soft)] text-[var(--primary-strong)]";
  }

  if (status === GeneratedPostStatus.APPROVED) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === GeneratedPostStatus.FAILED || status === GeneratedPostStatus.REJECTED) {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-slate-200 text-slate-600";
}

export default async function DashboardPage() {
  const session = await requireAuthSession();
  const overview = await getDashboardOverview(session.user.id);
  const hasFeeds = overview.totalFeeds > 0;
  const hasActivity = overview.recentActivity.length > 0;

  return (
    <PageContainer>
      <section data-onboarding="dashboard-summary" className="grid gap-6 xl:grid-cols-12">
        <article className="xl:col-span-3 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--primary)]">
              <ScheduleIcon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[var(--surface-low)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Queue
            </span>
          </div>
          <p className="font-[var(--font-display)] text-3xl font-bold text-slate-900">
            {overview.upcomingSyncCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">Pending syncs</p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            {overview.nextFeedForSync
              ? `${overview.nextFeedForSync.name} is due ${formatRelativeDate(
                  overview.nextFeedForSync.nextSyncAt,
                )}.`
              : "No feeds are waiting for the next polling cycle."}
          </p>
        </article>

        <article className="xl:col-span-3 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--primary)]">
              <ReviewIcon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[var(--tertiary-soft)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgb(79_73_100)]">
              AI Ready
            </span>
          </div>
          <p className="font-[var(--font-display)] text-3xl font-bold text-slate-900">
            {overview.queueCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">Ready for review</p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            {overview.approvedPostCount} approved and {overview.draftPostCount} draft posts are in
            the review flow.
          </p>
        </article>

        <article className="relative overflow-hidden rounded-xl bg-[linear-gradient(145deg,_#0053da_0%,_#0048c1_100%)] p-6 text-white shadow-sm xl:col-span-6">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">
              Pipeline impact
            </p>
            <p className="mt-2 font-[var(--font-display)] text-4xl font-bold tracking-[-0.04em]">
              {overview.activeFeedCount} live sources
            </p>
            <div className="mt-5 flex flex-wrap gap-6">
              <div className="min-w-[96px]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Attention
                </p>
                <p className="mt-1 text-lg font-bold">{overview.attentionFeedCount}</p>
              </div>
              <div className="min-w-[96px]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Scheduled
                </p>
                <p className="mt-1 text-lg font-bold">{overview.scheduledPostCount}</p>
              </div>
              <div className="min-w-[96px]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Published
                </p>
                <p className="mt-1 text-lg font-bold">{overview.publishedPostCount}</p>
              </div>
              <div className="min-w-[96px]">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                  Accounts
                </p>
                <p className="mt-1 text-lg font-bold">{overview.connectedAccountCount}</p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-5 -top-6 text-white/10">
            <SparkIcon className="h-44 w-44" />
          </div>
        </article>
      </section>

      <section data-onboarding="dashboard-activity" className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <span className="border-b-2 border-[var(--primary)] pb-4 text-sm font-semibold text-[var(--primary)] -mb-4">
              Recent Activity
            </span>
            <Link
              href="/feeds"
              className="pb-4 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 -mb-4"
            >
              Feed Library
            </Link>
            <Link
              href="/schedule"
              className="pb-4 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 -mb-4"
            >
              Publishing Schedule
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/queue"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <QueueIcon className="h-4 w-4" />
              Open queue
            </Link>
            <Link
              href="/feeds/new"
              className="button-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              <FeedsIcon className="h-4 w-4" />
              Add feed
            </Link>
          </div>
        </div>

        {hasActivity ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Title
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Source
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70">
                  {overview.recentActivity.map((item) => (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-2xl">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {item.article.title}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {formatActivityTime(item.updatedAt)} •{" "}
                            {getSocialPlatformLabel(item.platform)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${getSourceAvatarTone(
                              item.article.feed.name,
                            )}`}
                          >
                            {item.article.feed.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-slate-700">
                            {item.article.feed.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold ${getStatusClassName(
                            item.status,
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {getGeneratedPostStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <Link
                            href={`/queue/${item.id}`}
                            className="rounded px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          >
                            Review
                          </Link>
                          <Link
                            href={item.article.sourceUrl}
                            className="rounded bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                          >
                            Source
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 bg-slate-50/40 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {overview.recentActivity.length} recent queue items across{" "}
                {overview.activePlatformCount} active publishing platform
                {overview.activePlatformCount === 1 ? "" : "s"}.
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="/queue"
                  className="rounded border border-slate-200 bg-white px-3 py-1.5 font-bold transition-colors hover:bg-slate-100"
                >
                  View queue
                </Link>
                <Link
                  href="/feeds"
                  className="rounded border border-slate-200 bg-white px-3 py-1.5 font-bold transition-colors hover:bg-slate-100"
                >
                  Manage feeds
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 py-16">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
                <QueueIcon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-slate-900">
                {hasFeeds ? "Queue activity will appear here" : "Add a feed to start the pipeline"}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                {hasFeeds
                  ? "As drafts move through review, scheduling, and publishing, the latest activity will fill this dashboard table."
                  : "Configure a source, connect accounts, and the dashboard will start showing review and publishing activity in this layout."}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/feeds/new"
                  className="button-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
                >
                  <FeedsIcon className="h-4 w-4" />
                  Add first feed
                </Link>
                <Link
                  href="/accounts"
                  className="button-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
                >
                  <AccountsIcon className="h-4 w-4" />
                  Open accounts
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section data-onboarding="dashboard-sources" className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Feed library
              </p>
              <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                Source coverage
              </h2>
            </div>
            <Link
              href="/feeds"
              className="text-sm font-semibold text-[var(--primary)] hover:opacity-80"
            >
              Open feeds
            </Link>
          </div>

          <div className="mt-6 grid gap-4">
            {overview.recentFeeds.length > 0 ? (
              overview.recentFeeds.map((feed) => (
                <article
                  key={feed.id}
                  className="rounded-xl bg-slate-50/80 p-5"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">{feed.name}</h3>
                        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          {feed.status.toLowerCase()}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Next sync: {formatFeedTime(feed.nextSyncAt)}
                      </p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {feed.refreshIntervalMinutes} min cadence
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl bg-slate-50/80 p-6 text-sm text-slate-500">
                No sources configured yet.
              </div>
            )}
          </div>
        </section>

        <aside data-onboarding="dashboard-notes" className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Workspace
          </p>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            Operating notes
          </h2>
          <div className="mt-6 space-y-4 text-sm text-slate-500">
            <div className="rounded-xl bg-slate-50/80 p-4">
              <p className="font-semibold text-slate-900">Connected accounts</p>
              <p className="mt-1 leading-6">
                {overview.connectedAccountCount} connected account
                {overview.connectedAccountCount === 1 ? "" : "s"} across{" "}
                {overview.activePlatformCount} platform
                {overview.activePlatformCount === 1 ? "" : "s"}.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50/80 p-4">
              <p className="font-semibold text-slate-900">Publishing flow</p>
              <p className="mt-1 leading-6">
                {overview.scheduledPostCount} scheduled and {overview.publishedPostCount} published
                posts remain visible for follow-up.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50/80 p-4">
              <p className="font-semibold text-slate-900">Next source sync</p>
              <p className="mt-1 leading-6">
                {overview.nextFeedForSync
                  ? `${overview.nextFeedForSync.name} is due ${formatRelativeDate(
                      overview.nextFeedForSync.nextSyncAt,
                    )}.`
                  : "No feed syncs are queued right now."}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </PageContainer>
  );
}
