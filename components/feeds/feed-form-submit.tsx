"use client";

import { useFormStatus } from "react-dom";

export function FeedFormSubmit({
  idleLabel,
  pendingLabel,
}: Readonly<{
  idleLabel: string;
  pendingLabel: string;
}>) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="button-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
