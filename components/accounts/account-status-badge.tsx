import type { SocialAccountStatus } from "@prisma/client";

const ACCOUNT_STATUS_STYLES: Record<SocialAccountStatus, string> = {
  CONNECTED: "bg-[var(--primary-soft)] text-[var(--primary-strong)]",
  PENDING: "bg-[var(--surface-low)] text-[var(--muted)]",
  EXPIRED: "bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]",
  DISCONNECTED: "bg-[rgb(86_97_102_/_0.12)] text-[var(--muted)]",
};

const ACCOUNT_STATUS_LABELS: Record<SocialAccountStatus, string> = {
  CONNECTED: "Connected",
  PENDING: "Pending",
  EXPIRED: "Expired",
  DISCONNECTED: "Disconnected",
};

export function AccountStatusBadge({
  status,
}: Readonly<{
  status: SocialAccountStatus;
}>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${ACCOUNT_STATUS_STYLES[status]}`}
    >
      {ACCOUNT_STATUS_LABELS[status]}
    </span>
  );
}
