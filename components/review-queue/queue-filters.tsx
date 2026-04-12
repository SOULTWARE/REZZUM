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
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="mt-3 h-12 w-full rounded-[1rem] border border-transparent bg-[var(--surface-low)] px-4 text-sm text-[var(--foreground)] shadow-none outline-none focus:border-[var(--primary-soft)] focus:bg-white"
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
    <section className="surface-card rounded-[1.5rem] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Filters
          </p>
          <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
            Narrow the review queue
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
          Filter drafts by destination, review state, or source feed while the ingestion
          and generation services are still being wired.
        </p>
      </div>

      <form className="mt-6 grid gap-4 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
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
            className="button-primary inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold"
          >
            Apply filters
          </button>
          {active ? (
            <Link
              href="/queue"
              className="button-secondary inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}
