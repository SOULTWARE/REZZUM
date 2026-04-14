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
  accountOptions: {
    linkedin: Array<{ value: string; label: string }>;
    x: Array<{ value: string; label: string }>;
  };
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

function ToggleField({
  name,
  label,
  description,
  defaultChecked,
  onChange,
}: Readonly<{
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
  onChange: (checked: boolean) => void;
}>) {
  return (
    <label className="flex items-start gap-3 rounded-xl bg-[var(--surface-low)] p-4">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--ring-soft)]"
      />
      <span>
        <span className="block text-sm font-semibold text-[var(--foreground)]">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{description}</span>
      </span>
    </label>
  );
}

export function FeedForm({
  action,
  initialValues,
  accountOptions,
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
              <div className="grid gap-6">
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
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm"
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
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm"
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
                Personalization
              </h2>
            </div>

            <div className="surface-card rounded-xl p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Language
                  </span>
                  <input
                    name="defaultLanguage"
                    type="text"
                    defaultValue={initialValues.defaultLanguage}
                    onChange={(event) =>
                      setPreview((current) => ({
                        ...current,
                        defaultLanguage: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm"
                  />
                  <FieldError
                    id="feed-default-language-error"
                    errors={state.fieldErrors?.defaultLanguage}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Feel
                  </span>
                  <input
                    name="defaultFeel"
                    type="text"
                    defaultValue={initialValues.defaultFeel}
                    onChange={(event) =>
                      setPreview((current) => ({
                        ...current,
                        defaultFeel: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm"
                  />
                  <FieldError id="feed-default-feel-error" errors={state.fieldErrors?.defaultFeel} />
                </label>
              </div>

              <label className="mt-6 block space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Style notes
                </span>
                <textarea
                  name="styleNotes"
                  rows={5}
                  defaultValue={initialValues.styleNotes}
                  onChange={(event) =>
                    setPreview((current) => ({
                      ...current,
                      styleNotes: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm leading-7"
                />
                <FieldError id="feed-style-notes-error" errors={state.fieldErrors?.styleNotes} />
              </label>
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
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm"
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
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm"
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
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm leading-7"
                  />
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
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm leading-7"
                  />
                  <FieldError
                    id="feed-exclude-keywords-error"
                    errors={state.fieldErrors?.excludeKeywords}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-[var(--primary)]" />
              <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
                Publishing setup
              </h2>
            </div>

            <div className="surface-card rounded-xl p-6 sm:p-8">
              <div className="grid gap-4">
                <ToggleField
                  name="generateLinkedIn"
                  label="Generate LinkedIn posts"
                  description="Create LinkedIn company-page drafts for this feed."
                  defaultChecked={initialValues.generateLinkedIn}
                  onChange={(checked) =>
                    setPreview((current) => ({ ...current, generateLinkedIn: checked }))
                  }
                />
                <ToggleField
                  name="generateX"
                  label="Generate X posts"
                  description="Create X drafts for this feed."
                  defaultChecked={initialValues.generateX}
                  onChange={(checked) =>
                    setPreview((current) => ({ ...current, generateX: checked }))
                  }
                />
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    LinkedIn destination
                  </span>
                  <select
                    name="linkedinAccountId"
                    defaultValue={initialValues.linkedinAccountId}
                    onChange={(event) =>
                      setPreview((current) => ({
                        ...current,
                        linkedinAccountId: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm"
                  >
                    <option value="">Use workspace default / none</option>
                    {accountOptions.linkedin.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    X destination
                  </span>
                  <select
                    name="xAccountId"
                    defaultValue={initialValues.xAccountId}
                    onChange={(event) =>
                      setPreview((current) => ({
                        ...current,
                        xAccountId: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm"
                  >
                    <option value="">Use workspace default / none</option>
                    {accountOptions.x.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 space-y-4">
                <ToggleField
                  name="autoPublishEnabled"
                  label="Enable auto-publish cadence"
                  description="Automatically approve and schedule generated posts using the interval below."
                  defaultChecked={initialValues.autoPublishEnabled}
                  onChange={(checked) =>
                    setPreview((current) => ({ ...current, autoPublishEnabled: checked }))
                  }
                />

                <label className="block space-y-2">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Auto-publish interval (minutes)
                  </span>
                  <input
                    name="autoPublishIntervalMinutes"
                    type="number"
                    min={15}
                    defaultValue={initialValues.autoPublishIntervalMinutes}
                    onChange={(event) =>
                      setPreview((current) => ({
                        ...current,
                        autoPublishIntervalMinutes:
                          Number.parseInt(event.target.value, 10) || current.autoPublishIntervalMinutes,
                      }))
                    }
                    className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm"
                  />
                  <FieldError
                    id="feed-auto-publish-interval-error"
                    errors={state.fieldErrors?.autoPublishIntervalMinutes}
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
                  Personalization
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {preview.defaultLanguage} • {preview.defaultFeel}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {preview.styleNotes.trim() || "No extra style notes yet."}
                </p>
              </div>

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
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {preview.minimumWordCount} word minimum
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {includeKeywordCount} include keywords, {excludeKeywordCount} exclude keywords
                </p>
              </div>

              <div className="rounded-xl bg-[var(--surface-low)] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Delivery mode
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {preview.autoPublishEnabled
                    ? `Auto-publish every ${preview.autoPublishIntervalMinutes} minutes`
                    : "Manual review and scheduling"}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Platforms: {preview.generateLinkedIn ? "LinkedIn" : null}
                  {preview.generateLinkedIn && preview.generateX ? " and " : null}
                  {preview.generateX ? "X" : null}
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
              Review the current feed state and sync cadence before saving changes.
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
                    Last updated
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {formatDateTime(metadata.updatedAt)}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--surface-low)] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Next sync
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {formatDateTime(metadata.nextSyncAt)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-[var(--surface-low)] p-4 text-sm leading-6 text-[var(--muted)]">
                The feed will be scheduled for its first sync as soon as it is saved.
              </div>
            )}
          </aside>
        </div>
      </div>
    </form>
  );
}
