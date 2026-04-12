import { PageLoadingState } from "@/components/page-loading-state";

export default function DashboardLoading() {
  return <PageLoadingState intro={false} metrics={3} listCount={3} />;
}
