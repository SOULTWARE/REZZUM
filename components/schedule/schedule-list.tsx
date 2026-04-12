import Link from "next/link";
import { PostStatusBadge } from "@/components/review-queue/post-status-badge";
import { getSocialPlatformLabel } from "@/lib/review-queue/constants";
import type { ScheduleItem } from "@/server/schedule/service";

function formatPublishTime(post: ScheduleItem) {
  const value = post.scheduledFor ?? post.publishedAt ?? post.failedAt;

  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getPublishTimeLabel(post: ScheduleItem) {
  if (post.status === "PUBLISHED") {
    return "Published";
  }

  if (post.status === "FAILED") {
    return "Attempted";
  }

  return "Publish time";
}

function getItemContext(post: ScheduleItem) {
  if (post.status === "FAILED") {
    return post.failureReason ?? "The provider did not complete the last publish attempt.";
  }

  if (post.status === "PUBLISHED") {
    return "Successfully delivered to the destination platform.";
  }

  if (post.status === "SCHEDULED") {
    return "Still editable until the scheduled send is processed.";
  }

  if (post.status === "APPROVED") {
    return "Ready to be scheduled or published immediately.";
  }

  return "Still in draft and not reserved for a publish window yet.";
}

export function ScheduleList({ items }: Readonly<{ items: ScheduleItem[] }>) {
  return (
    <section className="grid gap-4">
      {items.map((post) => (
        <Link
          key={post.id}
          href={`/queue/${post.id}`}
          className="surface-card group rounded-[1.5rem] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--surface-low)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  {post.article.feed.name}
                </span>
                <span className="rounded-full bg-[var(--surface-low)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">
                  {getSocialPlatformLabel(post.platform)}
                </span>
                <PostStatusBadge status={post.status} />
              </div>

              <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                {post.article.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{getItemContext(post)}</p>
            </div>

            <div className="rounded-[1.25rem] bg-[var(--surface-low)] px-4 py-3 lg:min-w-[200px]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                {getPublishTimeLabel(post)}
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {formatPublishTime(post)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
