import { PageContainer } from "@/components/page-container";

function SkeletonCard() {
  return (
    <div className="surface-card animate-pulse rounded-[1.5rem] p-5 sm:p-6">
      <div className="h-5 w-40 rounded-full bg-[var(--surface-low)]" />
      <div className="mt-4 h-8 w-3/4 rounded-full bg-[var(--surface-low)]" />
      <div className="mt-4 h-4 w-full rounded-full bg-[var(--surface-low)]" />
      <div className="mt-3 h-4 w-5/6 rounded-full bg-[var(--surface-low)]" />
    </div>
  );
}

export default function QueueLoading() {
  return (
    <PageContainer>
      <section className="surface-card animate-pulse rounded-[1.5rem] p-6 sm:p-8">
        <div className="h-4 w-28 rounded-full bg-[var(--surface-low)]" />
        <div className="mt-4 h-10 w-2/3 rounded-full bg-[var(--surface-low)]" />
        <div className="mt-4 h-4 w-full rounded-full bg-[var(--surface-low)]" />
        <div className="mt-2 h-4 w-5/6 rounded-full bg-[var(--surface-low)]" />
      </section>

      <section className="surface-card animate-pulse rounded-[1.5rem] p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-4">
          <div className="h-12 rounded-[1rem] bg-[var(--surface-low)]" />
          <div className="h-12 rounded-[1rem] bg-[var(--surface-low)]" />
          <div className="h-12 rounded-[1rem] bg-[var(--surface-low)]" />
          <div className="h-12 rounded-full bg-[var(--surface-low)]" />
        </div>
      </section>

      <div className="grid gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </PageContainer>
  );
}
