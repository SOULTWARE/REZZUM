type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon?: React.ReactNode;
  badge?: string;
};

export function MetricCard({
  label,
  value,
  detail,
  icon,
  badge,
}: Readonly<MetricCardProps>) {
  return (
    <article className="surface-card rounded-[1.5rem] p-5">
      {icon || badge ? (
        <div className="mb-6 flex items-center justify-between gap-4">
          {icon ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
              {icon}
            </div>
          ) : (
            <span />
          )}

          {badge ? (
            <span className="rounded-full bg-[var(--surface-low)] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              {badge}
            </span>
          ) : null}
        </div>
      ) : null}

      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
        {label}
      </p>
      <p className="mt-3 font-[var(--font-display)] text-4xl font-semibold text-[var(--foreground)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{detail}</p>
    </article>
  );
}
