import type { GeneratedPostStatus } from "@prisma/client";
import { getGeneratedPostStatusLabel } from "@/lib/review-queue/constants";

const POST_STATUS_STYLES: Record<GeneratedPostStatus, string> = {
  DRAFT: "bg-[var(--surface-low)] text-[var(--muted)]",
  APPROVED: "bg-[var(--primary-soft)] text-[var(--primary-strong)]",
  REJECTED: "bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]",
  SCHEDULED: "bg-[var(--tertiary-soft)] text-[rgb(79_73_100)]",
  PUBLISHED: "bg-[rgb(31_110_74_/_0.12)] text-[rgb(31_110_74)]",
  FAILED: "bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]",
};

export function PostStatusBadge({
  status,
}: Readonly<{
  status: GeneratedPostStatus;
}>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${POST_STATUS_STYLES[status]}`}
    >
      {getGeneratedPostStatusLabel(status)}
    </span>
  );
}
