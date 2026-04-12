import { PageLoadingState } from "@/components/page-loading-state";

export default function FeedsLoading() {
  return <PageLoadingState introAction metrics={3} listCount={3} />;
}
