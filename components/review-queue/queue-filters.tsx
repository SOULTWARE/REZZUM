import Link from "next/link";
import {
  ALL_REVIEW_QUEUE_FILTER,
  hasActiveReviewQueueFilters,
  type ReviewQueueFilters,
} from "@/lib/review-queue/validation";

type QueueFiltersProps = {
  filters: ReviewQueueFilters;
  options: {
    platforms: Array<{ value: string; label: string }>;
    statuses: Array<{ value: string; label: string }>;
    feeds: Array<{ value: string; label: string }>;
  };
};

function FilterField({
  label,
  name,
  value,
  options,
}: Readonly<{
  label: string;
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
}>) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="mt-3 h-12 w-full rounded-lg border border-transparent bg-[var(--surface-low)] px-4 text-sm text-slate-900 shadow-none outline-none focus:border-[rgb(0_83_218_/_0.2)] focus:bg-white"
      >
        <option value={ALL_REVIEW_QUEUE_FILTER}>All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function QueueFilters({ filters, options }: Readonly<QueueFiltersProps>) {
  const active = hasActiveReviewQueueFilters(filters);

  return (
    <section data-onboarding="queue-filters" className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Filters
          </p>
          <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            Narrow the review queue
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-500">
          Filter drafts by destination, status, or source feed.
        </p>
      </div>

      <form
        method="get"
        aria-label="Review queue filters"
        className="mt-6 grid gap-4 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto]"
      >
        <FilterField
          label="Platform"
          name="platform"
          value={filters.platform}
          options={options.platforms}
        />
        <FilterField
          label="Status"
          name="status"
          value={filters.status}
          options={options.statuses}
        />
        <FilterField label="Feed" name="feed" value={filters.feed} options={options.feeds} />

        <div className="flex flex-wrap items-end gap-3 xl:justify-end">
          <button
            type="submit"
            className="button-primary inline-flex h-12 items-center rounded-lg px-5 text-sm font-semibold"
          >
            Apply filters
          </button>
          {active ? (
            <Link
              href="/queue"
              className="button-secondary inline-flex h-12 items-center rounded-lg px-5 text-sm font-semibold"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}
