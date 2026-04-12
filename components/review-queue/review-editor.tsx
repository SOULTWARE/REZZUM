import Link from "next/link";
import { QueueIcon } from "@/components/icons";
import { PostStatusBadge } from "@/components/review-queue/post-status-badge";
import {
  getGeneratedPostStatusLabel,
  getGenerationToneLabel,
  getSocialPlatformLabel,
} from "@/lib/review-queue/constants";
import type { ReviewQueueItem } from "@/server/review-queue/service";

function formatDateTime(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getCurrentDraftText(post: ReviewQueueItem) {
  return post.editedText ?? post.generatedText;
}

export function ReviewEditor({
  post,
  siblingPosts,
  isDemoData,
}: Readonly<{
  post: ReviewQueueItem;
  siblingPosts: ReviewQueueItem[];
  isDemoData: boolean;
}>) {
  const currentDraftText = getCurrentDraftText(post);
  const hasEdits = Boolean(post.editedText && post.editedText !== post.generatedText);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.86fr)_minmax(0,1.14fr)]">
      <aside className="surface-card rounded-[1.75rem] p-6 sm:p-8 xl:sticky xl:top-32">
        <Link
          href="/queue"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:opacity-80"
        >
          <QueueIcon className="h-4 w-4" />
          Back to queue
        </Link>

        <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
          Source article
        </p>
        <h1 className="mt-4 font-[var(--font-display)] text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          {post.article.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          {post.article.excerpt ?? post.article.contentText ?? "No article excerpt is available yet."}
        </p>

        <div className="mt-6 grid gap-4">
          <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Feed
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
              {post.article.feed.name}
            </p>
          </div>
          <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Article status
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
              {post.article.status.replaceAll("_", " ").toLowerCase()}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Published
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {formatDateTime(post.article.publishedAt)}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Discovered
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {formatDateTime(post.article.discoveredAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[1.25rem] bg-[var(--surface-low)] p-4 text-sm leading-7 text-[var(--muted)]">
          <p className="font-semibold text-[var(--foreground)]">Source URL</p>
          <a
            href={post.article.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block break-all text-[var(--primary)] hover:opacity-80"
          >
            {post.article.sourceUrl}
          </a>
        </div>

        {isDemoData ? (
          <div className="mt-6 rounded-[1.25rem] bg-[var(--tertiary-soft)] p-4 text-sm leading-7 text-[rgb(79_73_100)]">
            Queue and editor content is using development demo data until article ingestion and
            generation are connected to the real backend.
          </div>
        ) : null}
      </aside>

      <section className="grid gap-6">
        <section className="surface-card rounded-[1.75rem] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Draft editor
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                {getSocialPlatformLabel(post.platform)} review draft
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Review the generated copy, compare other platform variants, and keep moderation
                tied to the original source context.
              </p>
            </div>
            <PostStatusBadge status={post.status} />
          </div>

          {siblingPosts.length > 1 ? (
            <div className="mt-6 rounded-[1.25rem] bg-[var(--surface-low)] p-1">
              <div className="flex flex-wrap gap-1">
                {siblingPosts.map((siblingPost) => {
                  const active = siblingPost.id === post.id;

                  return (
                    <Link
                      key={siblingPost.id}
                      href={`/queue/${siblingPost.id}`}
                      className={`inline-flex min-w-[140px] items-center justify-center rounded-[1rem] px-4 py-2.5 text-sm font-semibold ${
                        active
                          ? "bg-white text-[var(--primary)] shadow-[var(--shadow-soft)]"
                          : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--foreground)]"
                      }`}
                    >
                      {getSocialPlatformLabel(siblingPost.platform)}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Tone
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {getGenerationToneLabel(post.tone)}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Prompt version
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {post.promptVersion}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Model
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {post.generationModel}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Last updated
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {formatDateTime(post.updatedAt)}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-[var(--surface-low)] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Current draft
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {hasEdits ? "Edited copy is currently in review." : "Showing the latest generated text."}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                {hasEdits ? "Edited" : "Generated"}
              </span>
            </div>

            <div className="mt-4 rounded-[1.25rem] bg-white p-5 shadow-[var(--shadow-soft)]">
              <p className="whitespace-pre-wrap text-sm leading-8 text-[var(--foreground)]">
                {currentDraftText}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
              <span>{currentDraftText.length} characters</span>
              <span>Version {post.versionNumber}</span>
            </div>
          </div>

          {hasEdits ? (
            <div className="mt-4 rounded-[1.25rem] bg-[var(--surface-low)] p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Original generation
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
                {post.generatedText}
              </p>
            </div>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
          <article className="surface-card rounded-[1.75rem] p-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Generation context
            </p>
            <h3 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
              Lifecycle details
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Status
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                  {getGeneratedPostStatusLabel(post.status)}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Generated at
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                  {formatDateTime(post.generatedAt)}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Reviewed at
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                  {formatDateTime(post.reviewedAt)}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                  Scheduled for
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                  {formatDateTime(post.scheduledFor)}
                </p>
              </div>
            </div>
          </article>

          <article className="surface-card rounded-[1.75rem] p-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Workflow handoff
            </p>
            <h3 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
              Action surface is next
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              This editor is ready to host approval, rejection, scheduling, and publish-now
              actions once the review workflow mutations are added.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-[var(--surface-low)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
                Approve flow
              </span>
              <span className="rounded-full bg-[var(--surface-low)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
                Reject flow
              </span>
              <span className="rounded-full bg-[var(--surface-low)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
                Schedule handoff
              </span>
            </div>
          </article>
        </section>
      </section>
    </div>
  );
}
