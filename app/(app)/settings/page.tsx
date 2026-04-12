import type { Metadata } from "next";
import {
  AccountsIcon,
  FeedsIcon,
  QueueIcon,
  ScheduleIcon,
  SettingsIcon,
  SparkIcon,
} from "@/components/icons";
import { PageContainer } from "@/components/page-container";

export const metadata: Metadata = {
  title: "Settings",
};

const workflowHighlights = [
  {
    label: "Workspace defaults",
    value: "28",
    detail: "Default controls across feed ingestion, generation, review, and publishing.",
    icon: SettingsIcon,
    badge: "Control",
  },
  {
    label: "Delivery guardrails",
    value: "12",
    detail: "Publishing, retry, quiet-hour, and failure handling preferences.",
    icon: ScheduleIcon,
    badge: "Safety",
  },
  {
    label: "Profile setup",
    value: "Ready",
    detail: "Identity, timezone, notifications, and account-level working preferences.",
    icon: AccountsIcon,
    badge: "Profile",
  },
];

const profileFields = [
  { label: "Full name", value: "Alex Rivera" },
  { label: "Email", value: "alex@rezzum.app" },
  { label: "Role", value: "Content Operations Lead" },
  { label: "Timezone", value: "America/New_York" },
  { label: "Locale", value: "English (US)" },
  { label: "Public handle", value: "@alexcurates" },
];

const workspaceIdentityFields = [
  { label: "Workspace name", value: "REZZUM Studio" },
  { label: "Default brand voice", value: "Editorial and precise" },
  { label: "Default review owner", value: "Alex Rivera" },
  { label: "Default publish timezone", value: "America/New_York" },
];

const workspaceDefaults = [
  {
    label: "Require approval before publish",
    description: "Keep every generated post in human review before any scheduling or delivery step.",
    enabled: true,
  },
  {
    label: "Preserve prior regenerated versions",
    description: "Keep version history available whenever a draft is regenerated or heavily edited.",
    enabled: true,
  },
  {
    label: "Keep source URL attached to every draft",
    description: "Always show the original article link and metadata inside the editor and timeline.",
    enabled: true,
  },
  {
    label: "Allow editing until publish time",
    description: "Scheduled posts remain editable until the publish worker actually takes over.",
    enabled: true,
  },
];

const generationSettings = [
  {
    label: "Default generation tone",
    value: "Professional",
    helper: "Applied when a feed does not override the tone.",
  },
  {
    label: "Primary strategic angle",
    value: "Technical depth",
    helper: "Shapes how generated drafts frame the source article.",
  },
  {
    label: "LinkedIn default target length",
    value: "1200 chars",
    helper: "Used as the baseline for long-form distribution.",
  },
  {
    label: "X default target length",
    value: "240 chars",
    helper: "Keeps short-form drafts concise by default.",
  },
];

const publishingSettings = [
  {
    label: "Retry failed publishes",
    description: "Attempt a safe retry when provider delivery fails and the idempotency guard permits it.",
    enabled: true,
  },
  {
    label: "Enforce quiet hours",
    description: "Prevent newly scheduled posts from landing outside the defined publishing window.",
    enabled: true,
  },
  {
    label: "Hold publishes when accounts expire",
    description: "Stop delivery if a connected account enters expired or disconnected state.",
    enabled: true,
  },
  {
    label: "Auto-log publish attempts",
    description: "Keep the latest provider response and attempt timestamp on every delivery event.",
    enabled: true,
  },
];

const feedIngestionSettings = [
  {
    label: "Default feed cadence",
    value: "Every hour",
    helper: "Used when a new feed is created without a custom refresh interval.",
  },
  {
    label: "Minimum article length",
    value: "300 words",
    helper: "Shorter articles stay out of the generation pipeline by default.",
  },
  {
    label: "Deduplication rule",
    value: "Canonical URL, then content hash",
    helper: "Controls how duplicate articles are detected before generation.",
  },
  {
    label: "Fallback article state",
    value: "Ready for review",
    helper: "Used when an article clears filtering but has not been processed further yet.",
  },
];

const notificationSettings = [
  {
    label: "Daily operations digest",
    description: "Receive a daily summary of queue, schedule, and feed activity.",
    enabled: true,
  },
  {
    label: "Failure alerts",
    description: "Send notifications when publish attempts fail or account tokens expire.",
    enabled: true,
  },
  {
    label: "Queue review nudges",
    description: "Highlight drafts that have remained unreviewed beyond the expected review window.",
    enabled: false,
  },
  {
    label: "Weekly workflow summary",
    description: "Share weekly throughput, publishing, and source coverage insights.",
    enabled: false,
  },
];

const securitySettings = [
  {
    label: "Session timeout",
    value: "12 hours",
    helper: "Recommended for individual operators managing publishing access.",
  },
  {
    label: "Sensitive token visibility",
    value: "Hidden by default",
    helper: "Provider secrets should never appear in operational UI surfaces.",
  },
  {
    label: "Audit retention",
    value: "90 days",
    helper: "Keep review and publish event history available for operational recovery.",
  },
  {
    label: "Access scope policy",
    value: "Least privilege",
    helper: "Connected destinations should only grant the scopes required for publishing.",
  },
];

function SummaryCard({
  label,
  value,
  detail,
  badge,
  icon: Icon,
}: Readonly<{
  label: string;
  value: string;
  detail: string;
  badge: string;
  icon: typeof SettingsIcon;
}>) {
  return (
    <article className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-low)] text-[var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-[var(--surface-low)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {badge}
        </span>
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 font-[var(--font-display)] text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
    </article>
  );
}

function SectionShell({
  eyebrow,
  title,
  icon,
  children,
  accent = "bg-[var(--primary)]",
}: Readonly<{
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: string;
}>) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-6 w-1 rounded-full ${accent}`} />
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              {eyebrow}
            </p>
          </div>
          <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            {title}
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-low)] text-[var(--primary)]">
          {icon}
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function ReadonlyField({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <input
        defaultValue={value}
        className="mt-3 h-12 w-full rounded-lg border border-transparent bg-[var(--surface-low)] px-4 text-sm text-slate-900 outline-none focus:border-[rgb(0_83_218_/_0.2)] focus:bg-white"
      />
    </label>
  );
}

function ReadonlyTextArea({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <textarea
        defaultValue={value}
        className="mt-3 min-h-28 w-full rounded-lg border border-transparent bg-[var(--surface-low)] px-4 py-3 text-sm leading-7 text-slate-900 outline-none focus:border-[rgb(0_83_218_/_0.2)] focus:bg-white"
      />
    </label>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
}: Readonly<{
  label: string;
  description: string;
  enabled: boolean;
}>) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl bg-[var(--surface-low)] p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <span
        className={`mt-0.5 inline-flex h-6 w-11 shrink-0 rounded-full p-1 transition-colors ${
          enabled ? "bg-[var(--primary)]" : "bg-slate-300"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
      <input defaultChecked={enabled} type="checkbox" className="sr-only" />
    </label>
  );
}

function ValueCard({
  label,
  value,
  helper,
}: Readonly<{
  label: string;
  value: string;
  helper: string;
}>) {
  return (
    <div className="rounded-xl bg-[var(--surface-low)] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-12">
        {workflowHighlights.map((item) => (
          <div key={item.label} className="xl:col-span-4">
            <SummaryCard {...item} />
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <div className="space-y-6">
          <SectionShell
            eyebrow="User profile"
            title="Personal profile and working context"
            icon={<AccountsIcon className="h-5 w-5" />}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex w-full max-w-[220px] flex-col items-center rounded-xl bg-[var(--surface-low)] p-5 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white text-2xl font-[var(--font-display)] font-bold text-slate-900 ring-4 ring-[var(--surface-high)]">
                  AR
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">Alex Rivera</p>
                <p className="mt-1 text-sm text-slate-500">Content Operations Lead</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgb(0_83_218_/_0.06)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  Profile ready
                </div>
              </div>

              <div className="grid flex-1 gap-4 md:grid-cols-2">
                {profileFields.map((field) => (
                  <ReadonlyField key={field.label} label={field.label} value={field.value} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <ReadonlyTextArea
                label="Bio"
                value="Runs editorial review, feed quality control, and publishing operations for REZZUM's RSS-to-social workflow."
              />
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="Workspace identity"
            title="Workspace defaults and editorial context"
            icon={<SettingsIcon className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {workspaceIdentityFields.map((field) => (
                <ReadonlyField key={field.label} label={field.label} value={field.value} />
              ))}
            </div>

            <div className="mt-6 grid gap-4">
              <ReadonlyTextArea
                label="Brand summary"
                value="REZZUM turns RSS feeds into reviewable, schedulable social media drafts with strong source traceability and editorial control."
              />
              <ReadonlyTextArea
                label="Editorial guidance"
                value="Prefer precise, sober language. Avoid hype, preserve factual framing from the source article, and keep the final copy useful for professional audiences."
              />
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="Generation defaults"
            title="AI generation and editorial shaping"
            icon={<SparkIcon className="h-5 w-5" />}
            accent="bg-[rgb(98_91_119)]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {generationSettings.map((setting) => (
                <ValueCard
                  key={setting.label}
                  label={setting.label}
                  value={setting.value}
                  helper={setting.helper}
                />
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <ToggleRow
                label="Generate both LinkedIn and X variants by default"
                description="Create platform-specific drafts whenever a source article passes filtering."
                enabled
              />
              <ToggleRow
                label="Attach source excerpt to the generation context"
                description="Pass summary context into generation whenever article excerpts are available."
                enabled
              />
              <ToggleRow
                label="Favor concise opening hooks"
                description="Bias the first lines toward fast-scanning hooks rather than longer summaries."
                enabled={false}
              />
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="Review workflow"
            title="Moderation, queue, and editorial safeguards"
            icon={<QueueIcon className="h-5 w-5" />}
          >
            <div className="space-y-4">
              {workspaceDefaults.map((item) => (
                <ToggleRow
                  key={item.label}
                  label={item.label}
                  description={item.description}
                  enabled={item.enabled}
                />
              ))}
            </div>
          </SectionShell>
        </div>

        <div className="space-y-6">
          <SectionShell
            eyebrow="Publishing"
            title="Delivery defaults and schedule rules"
            icon={<ScheduleIcon className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <ValueCard
                label="Default publish lead time"
                value="2 hours"
                helper="Suggested delay between approval and the first recommended schedule slot."
              />
              <ValueCard
                label="Quiet hours"
                value="22:00 to 07:00"
                helper="New scheduled posts should not land inside this reserved window."
              />
              <ValueCard
                label="Retry limit"
                value="2 attempts"
                helper="Maximum publish retries before the post remains in a failed state."
              />
              <ValueCard
                label="Default destination priority"
                value="LinkedIn, then X"
                helper="Used when both platform variants are approved and ready to schedule."
              />
            </div>

            <div className="mt-6 space-y-4">
              {publishingSettings.map((item) => (
                <ToggleRow
                  key={item.label}
                  label={item.label}
                  description={item.description}
                  enabled={item.enabled}
                />
              ))}
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="Feed ingestion"
            title="Source intake and article normalization"
            icon={<FeedsIcon className="h-5 w-5" />}
          >
            <div className="grid gap-4">
              {feedIngestionSettings.map((setting) => (
                <ValueCard
                  key={setting.label}
                  label={setting.label}
                  value={setting.value}
                  helper={setting.helper}
                />
              ))}
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="Notifications"
            title="Operational digests and alerts"
            icon={<AccountsIcon className="h-5 w-5" />}
            accent="bg-[rgb(98_91_119)]"
          >
            <div className="space-y-4">
              {notificationSettings.map((item) => (
                <ToggleRow
                  key={item.label}
                  label={item.label}
                  description={item.description}
                  enabled={item.enabled}
                />
              ))}
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="Security"
            title="Access, visibility, and audit defaults"
            icon={<SettingsIcon className="h-5 w-5" />}
          >
            <div className="grid gap-4">
              {securitySettings.map((setting) => (
                <ValueCard
                  key={setting.label}
                  label={setting.label}
                  value={setting.value}
                  helper={setting.helper}
                />
              ))}
            </div>
          </SectionShell>
        </div>
      </section>
    </PageContainer>
  );
}
