import Link from "next/link";
import { FeedsIcon } from "@/components/icons";

export function FeedEmptyState() {
  return (
    <section className="rounded-xl bg-white p-8 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-[var(--primary)]" />
        <h2 className="font-[var(--font-display)] text-xl font-semibold text-slate-900">
          Feed connection
        </h2>
      </div>

      <div className="mt-6 flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300/60 px-6 py-10 text-center transition-all hover:border-[rgb(0_83_218_/_0.35)] hover:bg-[rgb(0_83_218_/_0.04)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-high)] text-slate-600">
          <FeedsIcon className="h-6 w-6" />
        </div>
        <h3 className="mt-6 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-slate-900">
          Add your first RSS source
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          Connect a feed, define its filtering rules, and choose the refresh cadence that will
          drive the rest of the REZZUM pipeline.
        </p>
        <Link
          href="/feeds/new"
          className="button-primary mt-8 inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold"
        >
          Configure a feed
        </Link>
      </div>
    </section>
  );
}
