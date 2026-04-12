import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { PageEmptyState } from "@/components/page-empty-state";
import { QueueIcon } from "@/components/icons";
import { QueueFilters } from "@/components/review-queue/queue-filters";
import { QueueList } from "@/components/review-queue/queue-list";
import {
  hasActiveReviewQueueFilters,
  parseReviewQueueFilters,
} from "@/lib/review-queue/validation";
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
  const filters = parseReviewQueueFilters(await searchParams);
  const queue = await getReviewQueue(filters);
  const hasActiveFilters = hasActiveReviewQueueFilters(filters);
  const platformCount = new Set(queue.items.map((item) => item.platform)).size;
  const feedCount = new Set(queue.items.map((item) => item.article.feed.id)).size;

  return (
    <PageContainer>
      <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Review workflow
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              Generated drafts waiting on moderation
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
              Review generated posts before they move into scheduling or publish-now
              actions. Source context, platform variant, and draft state stay visible in one
              place.
            </p>
          </div>

          {queue.isDemoData ? (
            <span className="rounded-full bg-[var(--tertiary-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(79_73_100)]">
              Demo queue data
            </span>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Visible drafts",
              value: String(queue.items.length),
              detail: `${queue.totalItems} seeded post${queue.totalItems === 1 ? "" : "s"} aligned to the review schema`,
            },
            {
              label: "Platforms",
              value: String(platformCount),
              detail: "LinkedIn and X variants stay grouped by source article.",
            },
            {
              label: "Source feeds",
              value: String(feedCount),
              detail: "Queue filters can narrow drafts by the originating RSS source.",
            },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-[1.25rem] bg-[var(--surface-low)] p-4 sm:p-5"
            >
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                {card.label}
              </p>
              <p className="mt-3 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
                {card.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{card.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <QueueFilters filters={queue.filters} options={queue.filterOptions} />

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
              ? "Adjust the platform, status, or feed filters to widen the queue again."
              : "The queue will populate here once article ingestion and generation create real reviewable drafts."
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
    </PageContainer>
  );
}
