import Link from "next/link";
import { ScheduleIcon } from "@/components/icons";
import { PageEmptyState } from "@/components/page-empty-state";

export function ScheduleEmptyState() {
  return (
    <PageEmptyState
      eyebrow="Publishing schedule"
      title="There are no posts in the scheduling pipeline"
      description="Drafts will appear here once review moves them toward approval, scheduling, and eventual publishing."
      icon={<ScheduleIcon className="h-6 w-6" />}
      actions={
        <Link
          href="/queue"
          className="button-primary inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          Review drafts
        </Link>
      }
    />
  );
}
