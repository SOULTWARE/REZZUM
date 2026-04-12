"use client";

import { useActionState, useMemo, useState } from "react";
import type { FeedStatus } from "@prisma/client";
import { FeedStatusBadge } from "@/components/feeds/feed-status-badge";
import {
  FEED_REFRESH_INTERVAL_OPTIONS,
  getRefreshIntervalLabel,
  parseKeywordText,
  type FeedFormValues,
} from "@/lib/feeds/constants";
import {
  INITIAL_FEED_ACTION_STATE,
  type FeedActionState,
} from "@/lib/feeds/validation";

type FeedFormProps = {
  action: (state: FeedActionState, formData: FormData) => Promise<FeedActionState>;
  initialValues: FeedFormValues;
  metadata?: {
    status: FeedStatus;
    createdAt: Date;
    updatedAt: Date;
    nextSyncAt: Date | null;
  };
};

function formatDateTime(value: Date | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function FieldError({
  id,
  errors,
}: Readonly<{
  id: string;
  errors?: string[];
}>) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p id={id} role="alert" className="text-xs text-[rgb(117_33_33)]">
      {errors[0]}
    </p>
  );
}

export function FeedForm({
  action,
  initialValues,
  metadata,
}: Readonly<FeedFormProps>) {
  const [state, formAction] = useActionState(action, INITIAL_FEED_ACTION_STATE);
  const [preview, setPreview] = useState(initialValues);

  const includeKeywordCount = useMemo(
    () => parseKeywordText(preview.includeKeywords).length,
    [preview.includeKeywords],
  );
  const excludeKeywordCount = useMemo(
    () => parseKeywordText(preview.excludeKeywords).length,
    [preview.excludeKeywords],
  );

  const refreshDescription =
    FEED_REFRESH_INTERVAL_OPTIONS.find(
      (option) => option.value === preview.refreshIntervalMinutes,
    )?.description ?? "A custom cadence is selected.";

  return (
    <form id="feed-form" action={formAction} className="space-y-8">
      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-xl bg-[rgb(159_64_61_/_0.08)] px-4 py-3 text-sm text-[rgb(117_33_33)]"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-[var(--primary)]" />
              <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                Feed connection
              </h2>
            </div>

            <div className="surface-card rounded-xl p-6 sm:p-8">
              <div className="space-y-6">
                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Feed name
                  </span>
                  <input
                    name="name"
                    type="text"
                    defaultValue={initialValues.name}
                    onChange={(event) =>
                      setPreview((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="e.g. Product Updates"
                    aria-invalid={Boolean(state.fieldErrors?.name)}
                    aria-describedby={state.fieldErrors?.name ? "feed-name-error" : undefined}
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-soft)]"
                  />
                  <FieldError id="feed-name-error" errors={state.fieldErrors?.name} />
                </label>

                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    RSS URL
                  </span>
                  <input
                    name="rssUrl"
                    type="url"
                    defaultValue={initialValues.rssUrl}
                    onChange={(event) =>
                      setPreview((current) => ({ ...current, rssUrl: event.target.value }))
                    }
                    placeholder="https://example.com/feed.xml"
                    aria-invalid={Boolean(state.fieldErrors?.rssUrl)}
                    aria-describedby={state.fieldErrors?.rssUrl ? "feed-rss-url-error" : undefined}
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-soft)]"
                  />
                  <FieldError id="feed-rss-url-error" errors={state.fieldErrors?.rssUrl} />
                </label>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-[var(--primary)]" />
              <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                Signal filtering
              </h2>
            </div>

            <div className="surface-card rounded-xl p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Minimum word count
                  </span>
                  <input
                    name="minimumWordCount"
                    type="number"
                    min={0}
                    defaultValue={initialValues.minimumWordCount}
                    onChange={(event) =>
                      setPreview((current) => ({
                        ...current,
                        minimumWordCount: Number.parseInt(event.target.value, 10) || 0,
                      }))
                    }
                    aria-invalid={Boolean(state.fieldErrors?.minimumWordCount)}
                    aria-describedby={
                      state.fieldErrors?.minimumWordCount
                        ? "feed-minimum-word-count-error"
                        : undefined
                    }
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-soft)]"
                  />
                  <FieldError
                    id="feed-minimum-word-count-error"
                    errors={state.fieldErrors?.minimumWordCount}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Refresh interval
                  </span>
                  <select
                    name="refreshIntervalMinutes"
                    defaultValue={String(initialValues.refreshIntervalMinutes)}
                    onChange={(event) =>
                      setPreview((current) => ({
                        ...current,
                        refreshIntervalMinutes: Number.parseInt(
                          event.target.value,
                          10,
                        ) as FeedFormValues["refreshIntervalMinutes"],
                      }))
                    }
                    aria-invalid={Boolean(state.fieldErrors?.refreshIntervalMinutes)}
                    aria-describedby={
                      state.fieldErrors?.refreshIntervalMinutes
                        ? "feed-refresh-interval-error"
                        : undefined
                    }
                    className="w-full appearance-none rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-soft)]"
                  >
                    {FEED_REFRESH_INTERVAL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError
                    id="feed-refresh-interval-error"
                    errors={state.fieldErrors?.refreshIntervalMinutes}
                  />
                </label>
              </div>

              <div className="mt-6 space-y-6">
                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Include keywords
                  </span>
                  <textarea
                    name="includeKeywords"
                    rows={4}
                    defaultValue={initialValues.includeKeywords}
                    onChange={(event) =>
                      setPreview((current) => ({
                        ...current,
                        includeKeywords: event.target.value,
                      }))
                    }
                    placeholder="AI, launch, roadmap"
                    aria-invalid={Boolean(state.fieldErrors?.includeKeywords)}
                    aria-describedby={
                      state.fieldErrors?.includeKeywords
                        ? "feed-include-keywords-error"
                        : undefined
                    }
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm leading-7 text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-soft)]"
                  />
                  <p className="text-xs leading-6 text-[var(--muted)]">
                    Separate keywords with commas or new lines. Articles must match
                    at least one term when this list is used.
                  </p>
                  <FieldError
                    id="feed-include-keywords-error"
                    errors={state.fieldErrors?.includeKeywords}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Exclude keywords
                  </span>
                  <textarea
                    name="excludeKeywords"
                    rows={4}
                    defaultValue={initialValues.excludeKeywords}
                    onChange={(event) =>
                      setPreview((current) => ({
                        ...current,
                        excludeKeywords: event.target.value,
                      }))
                    }
                    placeholder="jobs, sponsored, hiring"
                    aria-invalid={Boolean(state.fieldErrors?.excludeKeywords)}
                    aria-describedby={
                      state.fieldErrors?.excludeKeywords
                        ? "feed-exclude-keywords-error"
                        : undefined
                    }
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm leading-7 text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-soft)]"
                  />
                  <p className="text-xs leading-6 text-[var(--muted)]">
                    Use exclusions to skip low-signal content.
                  </p>
                  <FieldError
                    id="feed-exclude-keywords-error"
                    errors={state.fieldErrors?.excludeKeywords}
                  />
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <aside className="surface-card rounded-xl p-6 sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Feed preview
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
              {preview.name.trim() || "Untitled feed"}
            </h2>
            <p className="mt-3 break-all text-sm leading-7 text-[var(--muted)]">
              {preview.rssUrl.trim() || "The saved RSS URL will appear here."}
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-[var(--surface-low)] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Refresh cadence
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {getRefreshIntervalLabel(preview.refreshIntervalMinutes)}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {refreshDescription}
                </p>
              </div>

              <div className="rounded-xl bg-[var(--surface-low)] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Filter snapshot
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {includeKeywordCount}
                    </p>
                    <p className="text-xs text-[var(--muted)]">Include keywords</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {excludeKeywordCount}
                    </p>
                    <p className="text-xs text-[var(--muted)]">Exclude keywords</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  Minimum article length: {preview.minimumWordCount} words.
                </p>
              </div>
            </div>
          </aside>

          <aside className="surface-card rounded-xl p-6 sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Sync settings
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
              Feed status
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Review the saved cadence, filters, and status for this source.
            </p>

            {metadata ? (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-[var(--surface-low)] p-4">
                  <span className="text-sm font-medium text-[var(--muted)]">Status</span>
                  <FeedStatusBadge status={metadata.status} />
                </div>
                <div className="rounded-xl bg-[var(--surface-low)] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Created
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {formatDateTime(metadata.createdAt)}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--surface-low)] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Updated
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {formatDateTime(metadata.updatedAt)}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--surface-low)] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Next sync slot
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {formatDateTime(metadata.nextSyncAt)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-[var(--surface-low)] p-4">
                <p className="text-sm leading-7 text-[var(--muted)]">
                  New feeds start active and use the selected refresh interval.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </form>
  );
}
