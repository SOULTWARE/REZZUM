import type { SocialAccountStatus } from "@prisma/client";

const ACCOUNT_STATUS_STYLES: Record<SocialAccountStatus, string> = {
  CONNECTED: "bg-[rgb(0_83_218_/_0.06)] text-[var(--primary)]",
  PENDING: "bg-[rgb(95_95_98_/_0.08)] text-[var(--muted)]",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${ACCOUNT_STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ACCOUNT_STATUS_LABELS[status]}
    </span>
  );
}
