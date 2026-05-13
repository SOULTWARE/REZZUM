import type { GeneratedPostStatus } from "@prisma/client";
import { getGeneratedPostStatusLabel } from "@/lib/review-queue/constants";

const POST_STATUS_STYLES: Record<GeneratedPostStatus, string> = {
  DRAFT: "bg-[rgb(95_95_98_/_0.08)] text-[var(--muted)]",
  APPROVED: "bg-[rgb(0_83_218_/_0.06)] text-[var(--primary)]",
  REJECTED: "bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]",
  SCHEDULED: "bg-[var(--tertiary-soft)] text-[rgb(79_73_100)]",
  PUBLISHING: "bg-[rgb(0_83_218_/_0.10)] text-[var(--primary-strong)]",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${POST_STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {getGeneratedPostStatusLabel(status)}
    </span>
  );
}
