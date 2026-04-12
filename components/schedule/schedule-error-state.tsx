import { ScheduleIcon } from "@/components/icons";
import type { ScheduleItem } from "@/server/schedule/service";

function formatDateTime(value: Date | null) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function ScheduleErrorState({
  failedItems,
}: Readonly<{
  failedItems: ScheduleItem[];
}>) {
  if (failedItems.length === 0) {
    return (
      <aside className="surface-card rounded-[1.5rem] p-6">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
          Delivery state
        </p>
        <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
          No failed publishes right now
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          Failed sends will surface here with enough context for a future retry flow.
        </p>
      </aside>
    );
  }

  return (
    <aside className="surface-card rounded-[1.5rem] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]">
          <ScheduleIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            Error state
          </p>
          <h2 className="mt-1 font-[var(--font-display)] text-2xl font-semibold text-[var(--foreground)]">
            Failed publish attempts need attention
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {failedItems.map((item) => (
          <div key={item.id} className="rounded-[1.25rem] bg-[var(--surface-low)] p-4">
            <p className="font-semibold text-[var(--foreground)]">{item.article.title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {item.failureReason ?? "The provider did not accept the post."}
            </p>
            <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Last attempt
            </p>
            <p className="mt-1 text-sm text-[var(--foreground)]">{formatDateTime(item.failedAt)}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
