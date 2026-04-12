import Link from "next/link";
import { FeedsIcon } from "@/components/icons";
import { PageEmptyState } from "@/components/page-empty-state";

export function FeedEmptyState() {
  return (
    <PageEmptyState
      eyebrow="Feed library"
      title="Add your first RSS source"
      description="Connect a feed, define its filters, and choose a refresh cadence."
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
