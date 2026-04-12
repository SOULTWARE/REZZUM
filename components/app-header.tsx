"use client";

import { MenuIcon, RezzumLogo } from "@/components/icons";

type AppHeaderProps = {
  title: string;
  description: string;
  onMenuClick: () => void;
};

export function AppHeader({
  title,
  description,
  onMenuClick,
}: Readonly<AppHeaderProps>) {
  return (
    <header className="sticky top-0 z-30 pt-4 sm:pt-6">
      <div className="surface-panel mx-4 rounded-[1.5rem] px-4 py-4 sm:mx-6 sm:px-5 lg:mx-10 lg:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-low)] text-[var(--foreground)] lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <RezzumLogo className="h-11 w-11" />
            </div>
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-soft)]">
                Workspace
              </p>
              <h1 className="mt-2 truncate font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-[2rem]">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                {description}
              </p>
            </div>
          </div>
          <div className="hidden rounded-full bg-[var(--tertiary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] sm:block">
            MVP workspace
          </div>
        </div>
      </div>
    </header>
  );
}
