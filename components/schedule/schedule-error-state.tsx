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
      <aside className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Delivery state
        </p>
        <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
          No failed publishes right now
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Delivery failures will appear here when a publish attempt needs follow-up.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgb(159_64_61_/_0.12)] text-[rgb(117_33_33)]">
          <ScheduleIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Error state
          </p>
          <h2 className="mt-1 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            Failed publish attempts need attention
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {failedItems.map((item) => (
          <div key={item.id} className="rounded-xl bg-[var(--surface-low)] p-4">
            <p className="font-semibold text-slate-900">{item.article.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {item.failureReason ?? "The provider did not accept the post."}
            </p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Last attempt
            </p>
            <p className="mt-1 text-sm text-slate-900">{formatDateTime(item.failedAt)}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
