import { AccountsIcon, PlusIcon } from "@/components/icons";

export function AccountEmptyState() {
  return (
    <section className="surface-card rounded-[1.75rem] p-8 sm:p-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
        <AccountsIcon className="h-6 w-6" />
      </div>
      <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
        Connected destinations
      </p>
      <h2 className="mt-4 max-w-2xl font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
        No social accounts are connected yet
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        REZZUM needs at least one active destination before drafts can move into scheduling or
        publishing. The MVP starts with LinkedIn and X.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          disabled
          className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70"
        >
          <PlusIcon className="h-4 w-4" />
          Connect new account
        </button>
      </div>
    </section>
  );
}
