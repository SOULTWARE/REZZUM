import type { SocialPlatform } from "@prisma/client";
import {
  DisconnectIcon,
  LinkedInIcon,
  SettingsIcon,
  XIcon,
} from "@/components/icons";
import { AccountStatusBadge } from "@/components/accounts/account-status-badge";
import type { SocialAccountRecord } from "@/server/accounts/repository";

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

function getPlatformAccent(platform: SocialPlatform) {
  if (platform === "LINKEDIN") {
    return "bg-[rgb(0_119_181_/_0.12)] text-[rgb(0_119_181)]";
  }

  return "bg-[rgb(42_52_57_/_0.12)] text-[var(--foreground)]";
}

function formatDateTime(value: Date | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getAccountContext(account: SocialAccountRecord) {
  if (account.status === "EXPIRED") {
    return `Token expired ${formatDateTime(account.tokenExpiresAt)}. Reconnection will be required.`;
  }

  if (account.status === "PENDING") {
    return "OAuth handoff has not been completed yet.";
  }

  if (account.status === "DISCONNECTED") {
    return `Disconnected ${formatDateTime(account.disconnectedAt)}.`;
  }

  return `Last validated ${formatDateTime(account.lastValidatedAt)}.`;
}

export function AccountCard({
  account,
  showPlatformLabel = false,
}: Readonly<{
  account: SocialAccountRecord;
  showPlatformLabel?: boolean;
}>) {
  return (
    <article className="surface-card rounded-[1.75rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${getPlatformAccent(
              account.platform,
            )}`}
          >
            <PlatformIcon platform={account.platform} className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            {showPlatformLabel ? (
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                {account.platform === "LINKEDIN" ? "LinkedIn" : "X"}
              </p>
            ) : null}
            <h2 className="mt-1 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {account.displayName}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {account.handle ?? account.profileUrl ?? "Handle will appear here after connection."}
            </p>
          </div>
        </div>
        <AccountStatusBadge status={account.status} />
      </div>

      <div className="mt-6 rounded-[1.25rem] bg-[var(--surface-low)] p-4">
        <p className="text-sm leading-7 text-[var(--muted)]">{getAccountContext(account)}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Provider ID
          </p>
          <p className="mt-2 break-all text-sm text-[var(--foreground)]">
            {account.providerAccountId ?? "Not assigned"}
          </p>
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Scopes
          </p>
          <p className="mt-2 text-sm text-[var(--foreground)]">
            {account.scopes.length > 0 ? account.scopes.join(", ") : "No scopes granted yet"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold disabled:opacity-70"
        >
          <SettingsIcon className="h-4 w-4" />
          Settings
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex items-center gap-2 rounded-full bg-[rgb(159_64_61_/_0.08)] px-4 py-2.5 text-sm font-semibold text-[rgb(117_33_33)] disabled:opacity-70"
        >
          <DisconnectIcon className="h-4 w-4" />
          Disconnect
        </button>
      </div>
    </article>
  );
}
