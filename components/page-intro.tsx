type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  badge,
  actions,
}: Readonly<PageIntroProps>) {
  return (
    <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-[var(--font-display)] text-[2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{description}</p>
        </div>

        {(badge || actions) && (
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            {badge}
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
