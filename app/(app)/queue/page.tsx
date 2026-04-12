import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/page-container";
import { MetricCard } from "@/components/metric-card";
import { PageEmptyState } from "@/components/page-empty-state";
import { PageIntro } from "@/components/page-intro";
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
      <PageIntro
        eyebrow="Review workflow"
        title="Review drafts"
        description="Compare platform variants, edit copy, and keep source context close."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Visible drafts"
          value={String(queue.items.length)}
          detail={`${queue.totalItems} drafts in the review queue.`}
        />
        <MetricCard
          label="Platforms"
          value={String(platformCount)}
          detail="Platform variants grouped by source article."
        />
        <MetricCard
          label="Source feeds"
          value={String(feedCount)}
          detail="Filter drafts by the originating feed."
        />
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
    </PageContainer>
  );
}
