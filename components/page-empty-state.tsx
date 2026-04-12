type PageEmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actions?: React.ReactNode;
};

export function PageEmptyState({
  eyebrow,
  title,
  description,
  icon,
  actions,
}: Readonly<PageEmptyStateProps>) {
  return (
    <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-low)] text-[var(--primary)]">
        {icon}
      </div>
      <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 max-w-2xl font-[var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">{description}</p>
      {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  );
}
