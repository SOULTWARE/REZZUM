"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
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
import type { ActionResult } from "@/lib/actions";
import { useToast } from "@/components/toast-provider";
import { PostStatusBadge } from "@/components/review-queue/post-status-badge";
import { getGenerationToneLabel, getSocialPlatformCharacterLimit } from "@/lib/review-queue/constants";

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
  generationModel: string | null;
  updatedAtLabel: string;
  versionNumber: number;
  hasEdits: boolean;
  originalGeneratedText: string;
  platformTabs: PlatformTab[];
  socialAccountId: string;
  accountOptions: Array<{ value: string; label: string }>;
  defaultScheduledFor: string;
  saveAction: (formData: FormData) => Promise<ActionResult>;
  approveAction: (formData: FormData) => Promise<ActionResult>;
  rejectAction: (formData: FormData) => Promise<ActionResult>;
  scheduleAction: (formData: FormData) => Promise<ActionResult>;
  publishNowAction: (formData: FormData) => Promise<ActionResult>;
  regenerateAction: (formData: FormData) => Promise<ActionResult>;
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

function ActionButton({
  label,
  icon,
  onClick,
  className,
  disabled,
}: Readonly<{
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className: string;
  disabled?: boolean;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {icon}
      {label}
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
  socialAccountId,
  accountOptions,
  defaultScheduledFor,
  saveAction,
  approveAction,
  rejectAction,
  scheduleAction,
  publishNowAction,
  regenerateAction,
}: Readonly<DraftEditorWorkspaceProps>) {
  const router = useRouter();
  const { pushToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState(draftText);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const characterLimit = getSocialPlatformCharacterLimit(platform);
  const isOverLimit = value.length > characterLimit;
  const destinationLabel = useMemo(() => {
    return accountOptions.find((option) => option.value === socialAccountId)?.label ?? "Unassigned";
  }, [accountOptions, socialAccountId]);

  function runAction(
    actionName: string,
    action: (formData: FormData) => Promise<ActionResult>,
  ) {
    if (!formRef.current) {
      return;
    }

    setPendingAction(actionName);

    startTransition(async () => {
      try {
        const result = await action(new FormData(formRef.current!));

        pushToast(result);

        if (result.redirectTo) {
          router.push(result.redirectTo);
          return;
        }

        if (result.refresh) {
          router.refresh();
        }
      } catch (error) {
        pushToast({
          status: "error",
          message: "Action failed.",
          detail: error instanceof Error ? error.message : "Unknown action failure.",
        });
      }

      setPendingAction(null);
    });
  }

  return (
    <form
      ref={formRef}
      data-onboarding="draft-editor"
      className="surface-card rounded-xl p-5 sm:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Draft editor
          </p>
          <h2 className="mt-3 font-[var(--font-display)] text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            {platform === "LINKEDIN" ? "LinkedIn" : "X"} review draft
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Review the draft, edit it, then approve, schedule, publish, or regenerate it.
          </p>
        </div>
        <PostStatusBadge status={status} />
      </div>

      <div data-onboarding="draft-platform-tabs" className="mt-6 rounded-xl bg-[var(--surface-low)] p-1">
        <div className="grid gap-1 sm:grid-cols-2">
          {platformTabs.map((tab) => {
            if (tab.href) {
              return (
                <Link
                  key={tab.platform}
                  href={tab.href}
                  aria-current={tab.active ? "page" : undefined}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${
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
                aria-disabled="true"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-[var(--muted-soft)] opacity-75"
              >
                <PlatformIcon platform={tab.platform} className="h-4 w-4" />
                {tab.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <div className="rounded-xl bg-[var(--surface-low)] p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Tone
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
            {getGenerationToneLabel(tone)}
          </p>
        </div>
        <div className="rounded-xl bg-[var(--surface-low)] p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Prompt version
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{promptVersion}</p>
        </div>
        <div className="rounded-xl bg-[var(--surface-low)] p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Model
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
            {generationModel ?? "Not recorded"}
          </p>
        </div>
        <div className="rounded-xl bg-[var(--surface-low)] p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Last updated
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{updatedAtLabel}</p>
        </div>
      </div>

      <div data-onboarding="draft-destination" className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="block rounded-xl bg-[var(--surface-low)] p-4">
          <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Destination account
          </span>
          <select
            name="socialAccountId"
            defaultValue={socialAccountId}
            className="mt-3 w-full rounded-lg bg-white px-4 py-3 text-sm text-[var(--foreground)]"
          >
            <option value="">Select a destination account</option>
            {accountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Current target: {destinationLabel}</p>
        </label>

        <label className="block rounded-xl bg-[var(--surface-low)] p-4">
          <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Schedule for
          </span>
          <input
            name="scheduledFor"
            type="datetime-local"
            defaultValue={defaultScheduledFor}
            className="mt-3 w-full rounded-lg bg-white px-4 py-3 text-sm text-[var(--foreground)]"
          />
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Leave blank until you are ready to schedule.
          </p>
        </label>
      </div>

      <div data-onboarding="draft-copy" className="mt-6 rounded-xl bg-[var(--surface-low)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Editable draft
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Version {versionNumber}. Keep the copy within the platform character limits.
            </p>
          </div>
        </div>

        <div className="relative mt-4">
          <textarea
            name="draftText"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-label="Editable draft content"
            aria-invalid={isOverLimit}
            className="h-[24rem] w-full resize-none rounded-xl bg-white p-5 text-sm leading-8 text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none"
          />
          <div
            className={`pointer-events-none absolute bottom-4 right-4 rounded-lg px-3 py-1 text-[0.72rem] font-semibold ${
              isOverLimit
                ? "bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]"
                : "bg-[var(--surface-low)] text-[var(--muted-soft)]"
            }`}
          >
            {value.length} / {characterLimit} chars
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <ActionButton
            label="Regenerate"
            icon={<RefreshIcon className="h-4 w-4" />}
            onClick={() => runAction("regenerate", regenerateAction)}
            className="bg-[var(--surface-high)] text-[var(--foreground)]"
            disabled={isPending}
          />
          <ActionButton
            label="Save Draft"
            icon={<SaveIcon className="h-4 w-4" />}
            onClick={() => runAction("save", saveAction)}
            className="bg-transparent text-[var(--muted)]"
            disabled={isPending}
          />
        </div>
      </div>

      {hasEdits ? (
        <div className="mt-4 rounded-xl bg-[var(--surface-low)] p-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Original generation
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
            {originalGeneratedText}
          </p>
        </div>
      ) : null}

      <div data-onboarding="draft-actions" className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--ghost-line)] pt-6">
        <ActionButton
          label="Reject"
          icon={<RejectIcon className="h-4 w-4" />}
          onClick={() => runAction("reject", rejectAction)}
          className="bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]"
          disabled={isPending}
        />
        <ActionButton
          label="Approve"
          icon={<ApproveIcon className="h-4 w-4" />}
          onClick={() => runAction("approve", approveAction)}
          className="bg-[var(--primary-soft)] text-[var(--primary-strong)]"
          disabled={isPending}
        />
        <ActionButton
          label="Schedule"
          icon={<CalendarIcon className="h-4 w-4" />}
          onClick={() => runAction("schedule", scheduleAction)}
          className="bg-[var(--surface-high)] text-[var(--foreground)]"
          disabled={isPending}
        />
        <ActionButton
          label={pendingAction === "publish" ? "Publishing..." : "Publish Now"}
          icon={<PublishIcon className="h-4 w-4" />}
          onClick={() => runAction("publish", publishNowAction)}
          className="button-primary text-white"
          disabled={isPending}
        />
      </div>
    </form>
  );
}
