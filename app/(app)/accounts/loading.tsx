import { PageLoadingState } from "@/components/page-loading-state";

export default function AccountsLoading() {
  return <PageLoadingState introAction metrics={3} listCount={3} />;
}
