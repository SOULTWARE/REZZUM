"use client";

import Link from "next/link";
import { useState } from "react";
import type { GeneratedPostStatus, GenerationTone, SocialPlatform } from "@prisma/client";
import {
  ApproveIcon,
  CalendarIcon,
  LinkedInIcon,
  PublishIcon,
  RefreshIcon,
  RejectIcon,
  SaveIcon,
  XIcon,
} from "@/components/icons";
import { PostStatusBadge } from "@/components/review-queue/post-status-badge";
import { getGenerationToneLabel, getSocialPlatformCharacterLimit } from "@/lib/review-queue/constants";
import type { ReviewEditorAction } from "@/lib/review-queue/editor-actions";

type PlatformTab = {
  platform: SocialPlatform;
  label: string;
  href: string | null;
  active: boolean;
};

type DraftEditorWorkspaceProps = {
  draftText: string;
  platform: SocialPlatform;
  status: GeneratedPostStatus;
  tone: GenerationTone;
  promptVersion: string;
  generationModel: string;
  updatedAtLabel: string;
  versionNumber: number;
  hasEdits: boolean;
  originalGeneratedText: string;
  platformTabs: PlatformTab[];
  actions: ReviewEditorAction[];
};

const ACTION_STYLES: Record<ReviewEditorAction["tone"], string> = {
  secondary: "bg-[var(--surface-high)] text-[var(--foreground)]",
  ghost: "bg-transparent text-[var(--muted)] hover:text-[var(--foreground)]",
  success: "bg-[var(--primary-soft)] text-[var(--primary-strong)]",
  danger: "bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]",
  primary: "button-primary text-white",
};

function PlatformIcon({
  platform,
  className,
}: Readonly<{
  platform: SocialPlatform;
  className?: string;
}>) {
  if (platform === "LINKEDIN") {
    return <LinkedInIcon className={className} />;
  }

  return <XIcon className={className} />;
}

function ActionIcon({
  actionId,
  className,
}: Readonly<{
  actionId: ReviewEditorAction["id"];
  className?: string;
}>) {
  switch (actionId) {
    case "regenerate":
      return <RefreshIcon className={className} />;
    case "saveDraft":
      return <SaveIcon className={className} />;
    case "approve":
      return <ApproveIcon className={className} />;
    case "reject":
      return <RejectIcon className={className} />;
    case "schedule":
      return <CalendarIcon className={className} />;
    case "publishNow":
      return <PublishIcon className={className} />;
  }
}

function ActionButton({ action }: Readonly<{ action: ReviewEditorAction }>) {
  const baseClassName =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <button
      type="button"
      disabled={action.disabled}
      aria-disabled={action.disabled}
      className={`${baseClassName} ${ACTION_STYLES[action.tone]}`}
    >
      <ActionIcon actionId={action.id} className="h-4 w-4" />
      {action.label}
    </button>
  );
}

export function DraftEditorWorkspace({
  draftText,
  platform,
  status,
  tone,
  promptVersion,
  generationModel,
  updatedAtLabel,
  versionNumber,
  hasEdits,
  originalGeneratedText,
  platformTabs,
  actions,
}: Readonly<DraftEditorWorkspaceProps>) {
  const [value, setValue] = useState(draftText);
  const characterLimit = getSocialPlatformCharacterLimit(platform);
  const isOverLimit = value.length > characterLimit;
  const toolbarActions = actions.filter((action) => action.placement === "toolbar");
  const footerActions = actions.filter((action) => action.placement === "footer");

  return (
    <section className="surface-card rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Draft editor
          </p>
          <h2 className="mt-3 font-[var(--font-display)] text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            {platform === "LINKEDIN" ? "LinkedIn" : "X"} review draft
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Review the generated copy, compare platform variants, and prepare the draft for
            approval, scheduling, or publishing.
          </p>
        </div>
        <PostStatusBadge status={status} />
      </div>

      <div className="mt-6 rounded-[1.25rem] bg-[var(--surface-low)] p-1">
        <div className="grid gap-1 sm:grid-cols-2">
          {platformTabs.map((tab) => {
            if (tab.href) {
              return (
                <Link
                  key={tab.platform}
                  href={tab.href}
                  className={`inline-flex items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-sm font-semibold ${
                    tab.active
                      ? "bg-white text-[var(--primary)] shadow-[var(--shadow-soft)]"
                      : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--foreground)]"
                  }`}
                >
                  <PlatformIcon platform={tab.platform} className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            }

            return (
              <span
                key={tab.platform}
                className="inline-flex items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-sm font-semibold text-[var(--muted-soft)] opacity-75"
              >
                <PlatformIcon platform={tab.platform} className="h-4 w-4" />
                {tab.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Tone
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
            {getGenerationToneLabel(tone)}
          </p>
        </div>
        <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Prompt version
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{promptVersion}</p>
        </div>
        <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Model
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{generationModel}</p>
        </div>
        <div className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Last updated
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{updatedAtLabel}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] bg-[var(--surface-low)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Editable draft
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {hasEdits
                ? "This version already includes editorial changes."
                : "Editing is available now. Persistence will connect when review mutations are added."}
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Version {versionNumber}
          </span>
        </div>

        <div className="relative mt-4">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-label="Editable draft content"
            placeholder="Draft content will appear here."
            className="h-[24rem] w-full resize-none rounded-[1.25rem] bg-white p-5 text-sm leading-8 text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none focus:shadow-[0_0_0_2px_var(--ring-soft)]"
          />

          <div
            className={`pointer-events-none absolute bottom-4 right-4 rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
              isOverLimit
                ? "bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]"
                : "bg-[var(--surface-low)] text-[var(--muted-soft)]"
            }`}
          >
            {value.length} / {characterLimit} chars
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {toolbarActions.map((action) => (
            <ActionButton key={action.id} action={action} />
          ))}
        </div>
      </div>

      {hasEdits ? (
        <div className="mt-4 rounded-[1.25rem] bg-[var(--surface-low)] p-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Original generation
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
            {originalGeneratedText}
          </p>
        </div>
      ) : null}

      <div className="mt-6 rounded-[1.25rem] bg-[var(--tertiary-soft)] p-4 text-sm leading-7 text-[rgb(79_73_100)]">
        Workflow controls are scaffolded here for the upcoming review and publishing backend.
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--ghost-line)] pt-6">
        {footerActions.map((action) => (
          <ActionButton key={action.id} action={action} />
        ))}
      </div>
    </section>
  );
}
