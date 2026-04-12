import { PageContainer } from "@/components/page-container";
import { LoadingList } from "@/components/page-loading-state";

export default function QueueEditorLoading() {
  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-[minmax(320px,0.86fr)_minmax(0,1.14fr)]">
        <div className="surface-card animate-pulse rounded-[1.75rem] p-6 sm:p-8">
          <div className="h-4 w-28 rounded-full bg-[var(--surface-low)]" />
          <div className="mt-6 h-10 w-5/6 rounded-full bg-[var(--surface-low)]" />
          <div className="mt-6 grid gap-4">
            <div className="h-24 rounded-[1.25rem] bg-[var(--surface-low)]" />
            <div className="h-24 rounded-[1.25rem] bg-[var(--surface-low)]" />
            <div className="h-40 rounded-[1.25rem] bg-[var(--surface-low)]" />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="surface-card animate-pulse rounded-[1.75rem] p-6">
            <div className="h-4 w-28 rounded-full bg-[var(--surface-low)]" />
            <div className="mt-4 h-10 w-2/3 rounded-full bg-[var(--surface-low)]" />
            <div className="mt-6 h-12 rounded-[1rem] bg-[var(--surface-low)]" />
            <div className="mt-6 h-[24rem] rounded-[1.25rem] bg-[var(--surface-low)]" />
          </div>
          <LoadingList count={2} />
        </div>
      </section>
    </PageContainer>
  );
}
