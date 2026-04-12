import Link from "next/link";
import { QueueIcon, ScheduleIcon, SparkIcon } from "@/components/icons";
import { PostStatusBadge } from "@/components/review-queue/post-status-badge";
import {
  getGenerationToneLabel,
  getSocialPlatformLabel,
} from "@/lib/review-queue/constants";
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
    return "Scheduled and awaiting delivery.";
  }

  if (post.status === "APPROVED") {
    return "Ready to be scheduled or published immediately.";
  }

  return "Draft with no publish time set.";
}

function trimText(value: string, length: number) {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length).trimEnd()}...`;
}

export function ScheduleList({ items }: Readonly<{ items: ScheduleItem[] }>) {
  return (
    <section className="grid gap-4">
      {items.map((post) => (
        <article
          key={post.id}
          className="rounded-xl border border-transparent bg-white p-5 shadow-sm transition-all duration-300 hover:border-[rgb(0_83_218_/_0.1)] sm:p-6"
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.02fr)_minmax(280px,0.98fr)]">
            <div className="rounded-xl bg-[var(--surface-low)] p-5">
              <div className="flex items-center gap-2">
                <QueueIcon className="h-4 w-4 text-[var(--primary)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Timeline item
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {post.article.feed.name}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
                  {getSocialPlatformLabel(post.platform)}
                </span>
                <PostStatusBadge status={post.status} />
              </div>

              <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                {post.article.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">{getItemContext(post)}</p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-slate-400">
                <span>Tone: {getGenerationToneLabel(post.tone)}</span>
                <span>Version: v{post.versionNumber}</span>
              </div>
            </div>

            <div>
              <div className="rounded-xl bg-[var(--surface-low)] p-5">
                <div className="flex items-center gap-2">
                  <ScheduleIcon className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    {getPublishTimeLabel(post)}
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">{formatPublishTime(post)}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {trimText(post.editedText ?? post.generatedText, 240)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={post.article.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-[var(--primary)] hover:opacity-80"
                >
                  Open source article
                </a>
                <Link
                  href={`/queue/${post.id}`}
                  className="button-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
                >
                  Open editor
                  <SparkIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
