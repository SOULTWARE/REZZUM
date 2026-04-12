import { PageLoadingState } from "@/components/page-loading-state";

export default function ScheduleLoading() {
  return <PageLoadingState intro={true} metrics={3} listCount={3} />;
}
