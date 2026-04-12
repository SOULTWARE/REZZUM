import type { SocialPlatform } from "@prisma/client";
import {
  DisconnectIcon,
  LinkedInIcon,
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
    return "bg-[#0077B5] text-white";
  }

  return "bg-[#111111] text-white";
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
    return `Token expired ${formatDateTime(account.tokenExpiresAt)}. Reconnection is required before publishing resumes.`;
  }

  if (account.status === "PENDING") {
    return "OAuth handoff has not been completed yet. Finish setup to enable publishing.";
  }

  if (account.status === "DISCONNECTED") {
    return `Disconnected ${formatDateTime(account.disconnectedAt)}.`;
  }

  return `Last validated ${formatDateTime(account.lastValidatedAt)}.`;
}

function getPlatformLabel(platform: SocialPlatform) {
  return platform === "LINKEDIN" ? "LinkedIn" : "X";
}

function getInitials(value: string) {
  const parts = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase());

  return parts.join("") || "A";
}

function getPrimaryActionLabel(account: SocialAccountRecord) {
  if (account.status === "PENDING") {
    return "Finish setup";
  }

  return "Settings";
}

export function AccountCard({
  account,
  showPlatformLabel = false,
}: Readonly<{
  account: SocialAccountRecord;
  showPlatformLabel?: boolean;
}>) {
  return (
    <article className="group rounded-xl border border-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:border-[rgb(0_83_218_/_0.1)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--surface-high)] ring-4 ring-[var(--surface-low)]">
            <span className="font-[var(--font-display)] text-xl font-bold text-slate-900">
              {getInitials(account.displayName)}
            </span>
          </div>
          <div
            className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-md border-2 border-white ${getPlatformAccent(
              account.platform,
            )}`}
          >
            <PlatformIcon platform={account.platform} className="h-3.5 w-3.5" />
          </div>
        </div>
        <AccountStatusBadge status={account.status} />
      </div>

      <div>
        <h2 className="font-[var(--font-display)] text-lg font-bold text-slate-900">
          {account.displayName}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {account.handle ?? account.profileUrl ?? "Profile details appear after connection."}
        </p>
        {showPlatformLabel ? (
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {getPlatformLabel(account.platform)}
          </p>
        ) : null}

        <div className="mt-4 rounded-xl bg-[var(--surface-low)] p-4">
          <p className="text-sm leading-6 text-slate-500">{getAccountContext(account)}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-slate-400">
            <span>Provider: {account.providerAccountId ?? "Not assigned"}</span>
            <span>
              Scopes: {account.scopes.length > 0 ? account.scopes.length : "Pending"}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors disabled:opacity-70 ${
              account.status === "PENDING"
                ? "button-primary text-white"
                : "bg-[var(--surface-low)] text-slate-500 hover:bg-[var(--surface-high)]"
            }`}
          >
            {getPrimaryActionLabel(account)}
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-low)] text-slate-500 transition-colors hover:bg-[rgb(159_64_61_/_0.14)] hover:text-[rgb(117_33_33)] disabled:opacity-70"
          >
            <DisconnectIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
