import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PostStatusBadge } from "@/components/review-queue/post-status-badge";
import { getSocialPlatformLabel } from "@/lib/review-queue/constants";
import type { ReviewQueueItem } from "@/server/review-queue/service";

function formatRelativeDate(value: Date) {
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

function getDraftPreview(item: ReviewQueueItem) {
  return item.editedText ?? item.generatedText;
}

export function QueueList({ items }: Readonly<{ items: ReviewQueueItem[] }>) {
  return (
    <section className="grid gap-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/queue/${item.id}`}
          aria-label={`Open ${getSocialPlatformLabel(item.platform)} draft for ${item.article.title}`}
          className="surface-card group rounded-[1.5rem] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--surface-low)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  {item.article.feed.name}
                </span>
                <span className="rounded-full bg-[var(--surface-low)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">
                  {getSocialPlatformLabel(item.platform)}
                </span>
                <PostStatusBadge status={item.status} />
              </div>

              <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                {item.article.title}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                {getDraftPreview(item)}
              </p>
            </div>

            <div className="flex flex-row items-end justify-between gap-4 lg:min-w-[190px] lg:flex-col lg:items-end">
              <div className="rounded-[1.25rem] bg-[var(--surface-low)] px-4 py-3 text-right">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Last updated
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                  {formatRelativeDate(item.updatedAt)}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                Open editor
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
