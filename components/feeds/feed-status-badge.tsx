import type { FeedStatus } from "@prisma/client";

const FEED_STATUS_STYLES: Record<FeedStatus, string> = {
  ACTIVE: "bg-[rgb(0_83_218_/_0.06)] text-[var(--primary)]",
  PAUSED: "bg-[rgb(95_95_98_/_0.08)] text-[var(--muted)]",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${FEED_STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {FEED_STATUS_LABELS[status]}
    </span>
  );
}

export function getFeedStatusLabel(status: FeedStatus) {
  return FEED_STATUS_LABELS[status];
}
