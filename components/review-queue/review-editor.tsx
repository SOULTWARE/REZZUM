import Link from "next/link";
import type { SocialPlatform } from "@prisma/client";
import { QueueIcon } from "@/components/icons";
import { DraftEditorWorkspace } from "@/components/review-queue/draft-editor-workspace";
import {
  getGeneratedPostStatusLabel,
  getSocialPlatformLabel,
  SUPPORTED_REVIEW_PLATFORMS,
} from "@/lib/review-queue/constants";
import { getReviewEditorActions } from "@/lib/review-queue/editor-actions";
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

function formatArticleStatus(status: ReviewQueueItem["article"]["status"]) {
  const normalized = status.replaceAll("_", " ").toLowerCase();

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function ReviewEditor({
  post,
  siblingPosts,
}: Readonly<{
  post: ReviewQueueItem;
  siblingPosts: ReviewQueueItem[];
}>) {
  const currentDraftText = getCurrentDraftText(post);
  const hasEdits = Boolean(post.editedText && post.editedText !== post.generatedText);
  const platformPosts = new Map<SocialPlatform, ReviewQueueItem>(
    siblingPosts.map((item) => [item.platform, item]),
  );
  const platformTabs = SUPPORTED_REVIEW_PLATFORMS.map((platform) => {
    const platformPost = platformPosts.get(platform) ?? null;

    return {
      platform,
      label: platformPost ? getSocialPlatformLabel(platform) : `${getSocialPlatformLabel(platform)} unavailable`,
      href: platformPost ? `/queue/${platformPost.id}` : null,
      active: platform === post.platform,
    };
  });
  const actions = getReviewEditorActions();

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
              {formatArticleStatus(post.article.status)}
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

        <div className="mt-6 rounded-[1.25rem] bg-[var(--surface-low)] p-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Excerpt
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {post.article.excerpt ?? "No short excerpt is available for this article yet."}
          </p>
        </div>

        <div className="mt-4 rounded-[1.25rem] bg-[var(--surface-low)] p-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Content preview
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            {post.article.contentText ?? "No content preview is available for this article yet."}
          </p>
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

      </aside>

      <section className="grid gap-6">
        <DraftEditorWorkspace
          draftText={currentDraftText}
          platform={post.platform}
          status={post.status}
          tone={post.tone}
          promptVersion={post.promptVersion}
          generationModel={post.generationModel}
          updatedAtLabel={formatDateTime(post.updatedAt)}
          versionNumber={post.versionNumber}
          hasEdits={hasEdits}
          originalGeneratedText={post.generatedText}
          platformTabs={platformTabs}
          actions={actions}
        />

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
          <article className="surface-card rounded-[1.75rem] p-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Details
            </p>
            <h3 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
              Post details
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
              Actions
            </p>
            <h3 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
              Review actions
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Approve, reject, schedule, or publish from here.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-[var(--surface-low)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
                Approve
              </span>
              <span className="rounded-full bg-[var(--surface-low)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
                Reject
              </span>
              <span className="rounded-full bg-[var(--surface-low)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
                Schedule
              </span>
            </div>
          </article>
        </section>
      </section>
    </div>
  );
}
