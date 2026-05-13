import type { Metadata } from "next";
import { GeneratedPostStatus } from "@prisma/client";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { QueueIcon, ReviewIcon, SparkIcon } from "@/components/icons";
import { QueueFilters } from "@/components/review-queue/queue-filters";
import { QueueList } from "@/components/review-queue/queue-list";
import {
  hasActiveReviewQueueFilters,
  parseReviewQueueFilters,
} from "@/lib/review-queue/validation";
import { getGeneratedPostStatusLabel } from "@/lib/review-queue/constants";
import { requireAuthSession } from "@/server/auth/session";
import { getReviewQueue } from "@/server/review-queue/service";

export const metadata: Metadata = {
  title: "Queue",
};

export const dynamic = "force-dynamic";

export default async function QueuePage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const session = await requireAuthSession();
  const filters = parseReviewQueueFilters(await searchParams);
  const queue = await getReviewQueue(session.user.id, filters);
  const hasActiveFilters = hasActiveReviewQueueFilters(filters);
  const platformCount = new Set(queue.items.map((item) => item.platform)).size;
  const feedCount = new Set(queue.items.map((item) => item.article.feed.id)).size;
  const statusCounts = queue.items.reduce<Partial<Record<GeneratedPostStatus, number>>>(
    (accumulator, item) => {
    accumulator[item.status] = (accumulator[item.status] ?? 0) + 1;
    return accumulator;
    },
    {},
  );
  const topStatuses = Object.entries(statusCounts) as Array<[GeneratedPostStatus, number]>;
  const topStatusSummary = topStatuses
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3);

  return (
    <PageContainer>
      <section data-onboarding="queue-summary" className="grid gap-6 xl:grid-cols-12">
        <article className="rounded-xl bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--primary)]">
              <ReviewIcon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[var(--surface-low)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Visible
            </span>
          </div>
          <p className="font-[var(--font-display)] text-3xl font-bold text-slate-900">
            {queue.items.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">Drafts in view</p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            {queue.totalItems} total draft{queue.totalItems === 1 ? "" : "s"} are currently in the
            review queue.
          </p>
        </article>

        <article className="rounded-xl bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--primary)]">
              <QueueIcon className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[rgb(223_213_247_/_0.5)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgb(79_73_100)]">
              Scope
            </span>
          </div>
          <p className="font-[var(--font-display)] text-3xl font-bold text-slate-900">
            {platformCount}/{feedCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">Platforms / feeds</p>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            Platform variants are grouped by source article and can be filtered by originating
            feed.
          </p>
        </article>

        <article className="relative overflow-hidden rounded-xl bg-[linear-gradient(145deg,_#0053da_0%,_#0048c1_100%)] p-6 text-white shadow-sm xl:col-span-6">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/75">
              Review flow
            </p>
            <p className="mt-2 font-[var(--font-display)] text-4xl font-bold tracking-[-0.04em]">
              Human review stays in the loop
            </p>
            <div className="mt-5 flex flex-wrap gap-6">
              {topStatusSummary.length > 0 ? (
                topStatusSummary.map(([status, count]) => (
                  <div key={status} className="min-w-[104px]">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">
                      {getGeneratedPostStatusLabel(status)}
                    </p>
                    <p className="mt-1 text-lg font-bold">{count}</p>
                  </div>
                ))
              ) : (
                <div className="min-w-[120px]">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-white/65">Queue</p>
                  <p className="mt-1 text-lg font-bold">0 items</p>
                </div>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute -right-5 -top-6 text-white/10">
            <SparkIcon className="h-44 w-44" />
          </div>
        </article>
      </section>

      <QueueFilters filters={queue.filters} options={queue.filterOptions} />

      <section data-onboarding="queue-list">
        {queue.items.length > 0 ? (
          <QueueList items={queue.items} />
        ) : (
          <PageEmptyState
            eyebrow="Review queue"
            title={
              hasActiveFilters
                ? "No drafts match these filters"
                : "No generated drafts are ready for review"
            }
            description={
              hasActiveFilters
                ? "Adjust the platform, status, or feed filters."
                : "Drafts ready for review will appear here."
            }
            icon={<QueueIcon className="h-6 w-6" />}
            actions={
              hasActiveFilters ? (
                <Link
                  href="/queue"
                  className="button-secondary inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold"
                >
                  Clear filters
                </Link>
              ) : null
            }
          />
        )}
      </section>
    </PageContainer>
  );
}
