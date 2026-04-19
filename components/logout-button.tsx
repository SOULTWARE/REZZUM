"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DisconnectIcon } from "@/components/icons";
import { authClient } from "@/lib/auth-client";

type LogoutButtonProps = {
  compact?: boolean;
};

export function LogoutButton({ compact = false }: Readonly<LogoutButtonProps>) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isPending}
      className={`inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70 ${
        compact ? "h-10 w-10 px-0 py-0" : "w-full"
      }`}
      aria-label="Log out"
      title="Log out"
    >
      {compact ? (
        "OUT"
      ) : (
        <>
          <DisconnectIcon className="mr-2 h-4 w-4" />
          {isPending ? "Signing out..." : "Log out"}
        </>
      )}
    </button>
  );
}
