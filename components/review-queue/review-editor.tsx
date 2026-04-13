import Link from "next/link";
import type { SocialPlatform } from "@prisma/client";
import { QueueIcon } from "@/components/icons";
import { DraftEditorWorkspace } from "@/components/review-queue/draft-editor-workspace";
import { getSocialPlatformLabel, SUPPORTED_REVIEW_PLATFORMS } from "@/lib/review-queue/constants";
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
  accountOptions,
  saveAction,
  approveAction,
  rejectAction,
  scheduleAction,
  publishNowAction,
  regenerateAction,
}: Readonly<{
  post: ReviewQueueItem;
  siblingPosts: ReviewQueueItem[];
  accountOptions: Array<{ value: string; label: string }>;
  saveAction: (formData: FormData) => Promise<void>;
  approveAction: (formData: FormData) => Promise<void>;
  rejectAction: (formData: FormData) => Promise<void>;
  scheduleAction: (formData: FormData) => Promise<void>;
  publishNowAction: (formData: FormData) => Promise<void>;
  regenerateAction: (formData: FormData) => Promise<void>;
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
  const defaultScheduledFor = post.scheduledFor
    ? new Date(post.scheduledFor.getTime() - post.scheduledFor.getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 16)
    : "";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.86fr)_minmax(0,1.14fr)]">
      <aside className="surface-card rounded-xl p-6 sm:p-8 xl:sticky xl:top-32">
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
          <div className="rounded-xl bg-[var(--surface-low)] p-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Feed
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
              {post.article.feed.name}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--surface-low)] p-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Article status
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
              {formatArticleStatus(post.article.status)}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div className="rounded-xl bg-[var(--surface-low)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Published
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {formatDateTime(post.article.publishedAt)}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--surface-low)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Discovered
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                {formatDateTime(post.article.discoveredAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-[var(--surface-low)] p-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Excerpt
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
            {post.article.excerpt ?? "No short excerpt is available for this article yet."}
          </p>
        </div>

        <div className="mt-4 rounded-xl bg-[var(--surface-low)] p-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Content preview
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            {post.article.contentText ?? "No content preview is available for this article yet."}
          </p>
        </div>

        <div className="mt-6 rounded-xl bg-[var(--surface-low)] p-4 text-sm leading-7 text-[var(--muted)]">
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
          socialAccountId={post.socialAccountId ?? ""}
          accountOptions={accountOptions}
          defaultScheduledFor={defaultScheduledFor}
          saveAction={saveAction}
          approveAction={approveAction}
          rejectAction={rejectAction}
          scheduleAction={scheduleAction}
          publishNowAction={publishNowAction}
          regenerateAction={regenerateAction}
        />
      </section>
    </div>
  );
}
