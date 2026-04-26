"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FeedsIcon, ScheduleIcon, SparkIcon } from "@/components/icons";
import { useToast } from "@/components/toast-provider";
import type { ActionResult } from "@/lib/actions";
import type { FeedRecord } from "@/server/feeds/repository";
import { FeedStatusBadge } from "@/components/feeds/feed-status-badge";
import { getRefreshIntervalLabel } from "@/lib/feeds/constants";
import {
  activateFeedAction,
  deleteFeedAction,
  pauseFeedAction,
  syncFeedNowAction,
} from "@/server/feeds/actions";

function formatDateTime(value: Date | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

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

function formatKeywordSummary(feed: FeedRecord) {
  return {
    includeKeywords: feed.filter?.includeKeywords ?? [],
    excludeKeywords: feed.filter?.excludeKeywords ?? [],
  };
}

function formatFeedPlatforms(feed: FeedRecord) {
  return [
    feed.generateFacebook ? "Facebook" : null,
    feed.generateLinkedIn ? "LinkedIn" : null,
    feed.generateX ? "X" : null,
  ]
    .filter(Boolean)
    .join(" + ");
}

function KeywordGroup({
  title,
  keywords,
  emptyLabel,
}: Readonly<{
  title: string;
  keywords: string[];
  emptyLabel: string;
}>) {
  return (
    <div className="rounded-xl bg-[var(--surface-low)] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      {keywords.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-slate-500">{emptyLabel}</p>
      )}
    </div>
  );
}

export function FeedList({ feeds }: Readonly<{ feeds: FeedRecord[] }>) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runFeedAction(actionId: string, action: () => Promise<ActionResult>) {
    setPendingActionId(actionId);

    startTransition(async () => {
      try {
        const result = await action();

        pushToast(result);

        if (result.refresh) {
          router.refresh();
        }
      } catch (error) {
        pushToast({
          status: "error",
          message: "Action failed.",
          detail: error instanceof Error ? error.message : "Unknown action failure.",
        });
      }

      setPendingActionId(null);
    });
  }

  return (
    <div className="grid gap-5">
      {feeds.map((feed) => {
        const keywordSummary = formatKeywordSummary(feed);
        const isBusy = isPending && pendingActionId?.startsWith(feed.id);

        return (
          <article
            key={feed.id}
            className="rounded-xl border border-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:border-[rgb(0_83_218_/_0.1)]"
          >
            <div className="min-w-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-high)] text-slate-900 ring-4 ring-[var(--surface-low)]">
                    <FeedsIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                        {feed.name}
                      </h2>
                      <FeedStatusBadge status={feed.status} />
                    </div>
                    <p className="mt-2 break-all text-sm leading-7 text-slate-500">
                      {feed.rssUrl}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/feeds/${feed.id}/edit`}
                    className="button-secondary inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold"
                  >
                    Edit feed
                  </Link>
                  {feed.status === "ACTIVE" ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        runFeedAction(`${feed.id}:pause`, () => pauseFeedAction(feed.id))
                      }
                      className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        runFeedAction(`${feed.id}:activate`, () => activateFeedAction(feed.id))
                      }
                      className="inline-flex items-center rounded-lg border border-[rgb(0_83_218_/_0.14)] px-4 py-2.5 text-sm font-semibold text-[var(--primary)] transition hover:bg-[rgb(0_83_218_/_0.04)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Run
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={feed.status !== "ACTIVE" || isBusy}
                    onClick={() =>
                      runFeedAction(`${feed.id}:sync`, () => syncFeedNowAction(feed.id))
                    }
                    className="button-primary inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sync now
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() =>
                      runFeedAction(`${feed.id}:delete`, () => deleteFeedAction(feed.id))
                    }
                    className="inline-flex items-center rounded-lg border border-[rgb(159_64_61_/_0.2)] px-4 py-2.5 text-sm font-semibold text-[rgb(117_33_33)] transition hover:bg-[rgb(159_64_61_/_0.06)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <section className="mt-6">
                <div className="grid gap-4 lg:grid-cols-4">
                  <div className="rounded-xl bg-[var(--surface-low)] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[var(--primary)]">
                        <ScheduleIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          Refresh cadence
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {getRefreshIntervalLabel(feed.refreshIntervalMinutes)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[var(--surface-low)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Next sync
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {formatRelativeDate(feed.nextSyncAt)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{formatDateTime(feed.nextSyncAt)}</p>
                  </div>

                  <div className="rounded-xl bg-[var(--surface-low)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Last sync
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {formatDateTime(feed.lastSyncedAt)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--surface-low)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Last update
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {formatDateTime(feed.updatedAt)}
                    </p>
                  </div>
                </div>

                {feed.syncError ? (
                  <div className="mt-4 flex gap-3 rounded-xl border-l-4 border-[rgb(159_64_61)] bg-[rgb(159_64_61_/_0.08)] p-4">
                    <SparkIcon className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(117_33_33)]" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        Sync issue
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[rgb(117_33_33)]">
                        {feed.syncError}
                      </p>
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="mt-8">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1 rounded-full bg-[var(--primary)]" />
                  <h3 className="font-[var(--font-display)] text-xl font-semibold text-slate-900">
                    Signal filtering
                  </h3>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <KeywordGroup
                    title="Include keywords"
                    keywords={keywordSummary.includeKeywords}
                    emptyLabel="No include keywords configured."
                  />
                  <KeywordGroup
                    title="Exclude keywords"
                    keywords={keywordSummary.excludeKeywords}
                    emptyLabel="No exclude keywords configured."
                  />
                  <div className="rounded-xl bg-[var(--surface-low)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Minimum word count
                    </p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {feed.filter?.minimumWordCount ?? 0} words
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Shorter items stay out of the generation pipeline.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-1 rounded-full bg-[var(--primary)]" />
                  <h3 className="font-[var(--font-display)] text-xl font-semibold text-slate-900">
                    Publishing
                  </h3>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl bg-[var(--surface-low)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Personalization
                    </p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {feed.defaultLanguage ?? "Default"} • {feed.defaultFeel ?? "Default"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {feed.styleNotes?.trim() || "Uses workspace style defaults."}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--surface-low)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Destinations
                    </p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {formatFeedPlatforms(feed) || "None"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Facebook: {feed.facebookAccount?.displayName ?? "Workspace default / none"}
                      <br />
                      LinkedIn: {feed.linkedinAccount?.displayName ?? "Workspace default / none"}
                      <br />
                      X: {feed.xAccount?.displayName ?? "Workspace default / none"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--surface-low)] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Delivery mode
                    </p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {feed.autoPublishEnabled
                        ? `Every ${feed.autoPublishIntervalMinutes ?? feed.refreshIntervalMinutes} min`
                        : "Manual"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {feed.autoPublishEnabled
                        ? "Generated posts are auto-approved and scheduled."
                        : "Posts stay in review until you approve or schedule them."}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </article>
        );
      })}
    </div>
  );
}
