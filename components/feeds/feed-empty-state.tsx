import Link from "next/link";
import { FeedsIcon } from "@/components/icons";
import { PageEmptyState } from "@/components/page-empty-state";

export function FeedEmptyState() {
  return (
    <PageEmptyState
      eyebrow="Feed library"
      title="Add your first RSS source"
      description="Start the REZZUM pipeline by connecting a feed, defining its keyword filters, and choosing the cadence future sync jobs should follow."
      icon={<FeedsIcon className="h-6 w-6" />}
      actions={
        <Link
          href="/feeds/new"
          className="button-primary inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          Configure a feed
        </Link>
      }
    />
  );
}
