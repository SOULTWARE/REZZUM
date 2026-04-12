import Link from "next/link";
import { ScheduleIcon } from "@/components/icons";

export function ScheduleEmptyState() {
  return (
    <section className="rounded-xl bg-white p-8 shadow-sm">
      <div className="mx-auto flex max-w-2xl flex-col items-center py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-high)] text-[var(--primary)]">
          <ScheduleIcon className="h-6 w-6" />
        </div>
        <h2 className="mt-6 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-slate-900">
          There are no posts in the scheduling pipeline
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          Approved, scheduled, published, and failed delivery states will appear here as the queue
          moves forward.
        </p>
        <Link
          href="/queue"
          className="button-primary mt-8 inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold"
        >
          Review drafts
        </Link>
      </div>
    </section>
  );
}
