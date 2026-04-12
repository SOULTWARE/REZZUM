import { PageContainer } from "@/components/page-container";

function SkeletonBlock({
  className,
}: Readonly<{
  className: string;
}>) {
  return <div className={`animate-pulse rounded-full bg-[var(--surface-low)] ${className}`} />;
}

export function LoadingIntroCard({
  withAction = false,
}: Readonly<{
  withAction?: boolean;
}>) {
  return (
    <section className="surface-card rounded-[1.5rem] p-6 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="mt-4 h-10 w-full max-w-xl" />
          <SkeletonBlock className="mt-4 h-4 w-full" />
          <SkeletonBlock className="mt-3 h-4 w-5/6 max-w-3xl" />
        </div>
        {withAction ? <SkeletonBlock className="h-12 w-40" /> : null}
      </div>
    </section>
  );
}

export function LoadingMetricGrid({
  count = 3,
}: Readonly<{
  count?: number;
}>) {
  return (
    <section className={`grid gap-4 ${count > 1 ? "md:grid-cols-3" : ""}`}>
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="surface-card rounded-[1.5rem] p-5">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="mt-4 h-10 w-20" />
          <SkeletonBlock className="mt-4 h-4 w-full" />
          <SkeletonBlock className="mt-3 h-4 w-4/5" />
        </article>
      ))}
    </section>
  );
}

export function LoadingList({
  count = 3,
}: Readonly<{
  count?: number;
}>) {
  return (
    <section className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="surface-card animate-pulse rounded-[1.5rem] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <div className="h-7 w-28 rounded-full bg-[var(--surface-low)]" />
                <div className="h-7 w-20 rounded-full bg-[var(--surface-low)]" />
              </div>
              <div className="mt-4 h-8 w-full max-w-2xl rounded-full bg-[var(--surface-low)]" />
              <div className="mt-4 h-4 w-full rounded-full bg-[var(--surface-low)]" />
              <div className="mt-3 h-4 w-5/6 rounded-full bg-[var(--surface-low)]" />
            </div>
            <div className="h-16 w-full max-w-[220px] rounded-[1.25rem] bg-[var(--surface-low)]" />
          </div>
        </article>
      ))}
    </section>
  );
}

export function PageLoadingState({
  intro = true,
  introAction = false,
  metrics = 3,
  showFilters = false,
  listCount = 3,
}: Readonly<{
  intro?: boolean;
  introAction?: boolean;
  metrics?: number;
  showFilters?: boolean;
  listCount?: number;
}>) {
  return (
    <PageContainer>
      {intro ? <LoadingIntroCard withAction={introAction} /> : null}
      {metrics > 0 ? <LoadingMetricGrid count={metrics} /> : null}
      {showFilters ? (
        <section className="surface-card animate-pulse rounded-[1.5rem] p-5 sm:p-6">
          <div className="grid gap-4 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
            <div className="h-12 rounded-[1rem] bg-[var(--surface-low)]" />
            <div className="h-12 rounded-[1rem] bg-[var(--surface-low)]" />
            <div className="h-12 rounded-[1rem] bg-[var(--surface-low)]" />
            <div className="h-12 rounded-full bg-[var(--surface-low)]" />
          </div>
        </section>
      ) : null}
      {listCount > 0 ? <LoadingList count={listCount} /> : null}
    </PageContainer>
  );
}
