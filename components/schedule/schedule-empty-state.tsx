import Link from "next/link";
import { ScheduleIcon } from "@/components/icons";

export function ScheduleEmptyState() {
  return (
    <section className="surface-card rounded-[1.75rem] p-8 sm:p-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
        <ScheduleIcon className="h-6 w-6" />
      </div>
      <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
        Publishing calendar
      </p>
      <h2 className="mt-4 max-w-2xl font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
        There are no posts in the scheduling pipeline
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        Drafts will appear here once review moves them toward approval, scheduling, and
        eventual publishing.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/queue"
          className="button-primary inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          Review drafts
        </Link>
      </div>
    </section>
  );
}
