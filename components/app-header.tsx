"use client";

import Link from "next/link";
import { MenuIcon, RezzumLogo } from "@/components/icons";
import { getShellPage, type ShellAction } from "@/lib/navigation";

type AppHeaderProps = {
  pathname: string;
  onMenuClick: () => void;
};

function renderActionIcon(action: ShellAction) {
  const Icon = action.icon;

  return Icon ? <Icon className="h-4 w-4" /> : null;
}

function ActionButton({
  action,
  className,
}: Readonly<{
  action: ShellAction;
  className?: string;
}>) {
  const toneClassName =
    action.tone === "primary"
      ? "button-primary"
      : action.tone === "secondary"
        ? "button-secondary"
        : "bg-transparent text-[var(--muted)] hover:text-[var(--foreground)]";
  const visibilityClassName = action.mobileHidden ? "hidden sm:inline-flex" : "inline-flex";
  const buttonClassName = `${visibilityClassName} items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-70 ${toneClassName} ${className ?? ""}`.trim();

  if (action.href) {
    return (
      <Link href={action.href} className={buttonClassName}>
        {renderActionIcon(action)}
        {action.label}
      </Link>
    );
  }

  return (
    <button
      type={action.formId ? "submit" : "button"}
      form={action.formId}
      disabled={action.disabled}
      aria-disabled={action.disabled}
      className={buttonClassName}
    >
      {renderActionIcon(action)}
      {action.label}
    </button>
  );
}

export function AppHeader({ pathname, onMenuClick }: Readonly<AppHeaderProps>) {
  const page = getShellPage(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-2xl">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700 lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon className="h-5 w-5" />
            </button>

            <div className="lg:hidden">
              <RezzumLogo className="h-10 w-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-[2rem]">
                {page.title}
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {page.description}
              </p>
            </div>
          </div>

          {page.actions.length > 0 ? (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
              {page.actions.map((action) => (
                <ActionButton key={action.label} action={action} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
