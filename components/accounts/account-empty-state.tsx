import { AccountsIcon, PlusIcon } from "@/components/icons";
import { PageEmptyState } from "@/components/page-empty-state";

export function AccountEmptyState() {
  return (
    <PageEmptyState
      eyebrow="Connected destinations"
      title="No social accounts are connected yet"
      description="Connect at least one account before scheduling or publishing drafts."
      icon={<AccountsIcon className="h-6 w-6" />}
      actions={
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70"
        >
          <PlusIcon className="h-4 w-4" />
          Connect new account
        </button>
      }
    />
  );
}
