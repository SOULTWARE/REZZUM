import Link from "next/link";
import { ArrowRightIcon, QueueIcon, SparkIcon } from "@/components/icons";
import { PostStatusBadge } from "@/components/review-queue/post-status-badge";
import {
  getGenerationToneLabel,
  getSocialPlatformLabel,
} from "@/lib/review-queue/constants";
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

function getSourcePreview(item: ReviewQueueItem) {
  return item.article.excerpt ?? item.article.contentText ?? "Source context is attached to this draft.";
}

function trimText(value: string, length: number) {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length).trimEnd()}...`;
}

export function QueueList({ items }: Readonly<{ items: ReviewQueueItem[] }>) {
  return (
    <section className="grid gap-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-transparent bg-white p-5 shadow-sm transition-all duration-300 hover:border-[rgb(0_83_218_/_0.1)] sm:p-6"
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="rounded-xl bg-[var(--surface-low)] p-5">
              <div className="flex items-center gap-2">
                <QueueIcon className="h-4 w-4 text-[var(--primary)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Source content
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {item.article.feed.name}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
                  {getSocialPlatformLabel(item.platform)}
                </span>
                <PostStatusBadge status={item.status} />
              </div>

              <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                {item.article.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {trimText(getSourcePreview(item), 220)}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-slate-400">
                <span>Tone: {getGenerationToneLabel(item.tone)}</span>
                <span>Updated: {formatRelativeDate(item.updatedAt)}</span>
                <span>Version: v{item.versionNumber}</span>
              </div>
            </div>

            <div className="rounded-xl bg-white">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[rgb(223_213_247_/_0.5)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[rgb(79_73_100)]">
                    <SparkIcon className="h-3.5 w-3.5" />
                    Curated draft
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Ready for editor review
                  </p>
                </div>

                <Link
                  href={`/queue/${item.id}`}
                  aria-label={`Open ${getSocialPlatformLabel(item.platform)} draft for ${item.article.title}`}
                  className="button-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
                >
                  Open editor
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 rounded-xl bg-[var(--surface-low)] p-5">
                <p className="text-sm leading-7 text-slate-700">
                  {trimText(getDraftPreview(item), 360)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={item.article.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-[var(--primary)] hover:opacity-80"
                >
                  Open source article
                </a>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
