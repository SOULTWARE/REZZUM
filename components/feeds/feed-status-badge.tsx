import type { FeedStatus } from "@prisma/client";

const FEED_STATUS_STYLES: Record<FeedStatus, string> = {
  ACTIVE: "bg-[var(--primary-soft)] text-[var(--primary-strong)]",
  PAUSED: "bg-[var(--surface-low)] text-[var(--muted)]",
  ERROR: "bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]",
  ARCHIVED: "bg-[rgb(86_97_102_/_0.12)] text-[var(--muted)]",
};

const FEED_STATUS_LABELS: Record<FeedStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  ERROR: "Error",
  ARCHIVED: "Archived",
};

export function FeedStatusBadge({
  status,
}: Readonly<{
  status: FeedStatus;
}>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${FEED_STATUS_STYLES[status]}`}
    >
      {FEED_STATUS_LABELS[status]}
    </span>
  );
}

export function getFeedStatusLabel(status: FeedStatus) {
  return FEED_STATUS_LABELS[status];
}
