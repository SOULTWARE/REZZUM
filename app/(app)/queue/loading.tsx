import { PageLoadingState } from "@/components/page-loading-state";

export default function QueueLoading() {
  return <PageLoadingState introAction={false} metrics={3} showFilters listCount={3} />;
}
