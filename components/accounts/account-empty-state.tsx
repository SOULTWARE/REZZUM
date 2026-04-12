import { AccountsIcon } from "@/components/icons";

export function AccountEmptyState() {
  return (
    <article className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300/60 p-6 text-center transition-all hover:border-[rgb(0_83_218_/_0.35)] hover:bg-[rgb(0_83_218_/_0.04)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-high)] text-[var(--muted)]">
        <AccountsIcon className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-slate-600">Add another connection</p>
      <p className="max-w-[180px] text-xs leading-5 text-slate-400">
        Connect LinkedIn or X to expand automated publishing coverage.
      </p>
    </article>
  );
}
