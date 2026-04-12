"use client";

import Link from "next/link";
import { MenuCloseIcon, RezzumLogo } from "@/components/icons";
import { primaryNavigation, secondaryNavigation } from "@/lib/navigation";

type AppSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
  pathname: string;
};

export function AppSidebar({
  mobileOpen,
  onClose,
  pathname,
}: Readonly<AppSidebarProps>) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[rgb(42_52_57_/_0.16)] backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[var(--surface-low)] px-4 py-5 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <RezzumLogo className="h-10 w-10" />
            <div>
              <p className="font-[var(--font-display)] text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                REZZUM
              </p>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-soft)]">
                RSS to social
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[var(--muted)] lg:hidden"
            aria-label="Close navigation"
          >
            <MenuCloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col justify-between">
          <div className="space-y-1.5">
            {primaryNavigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "surface-card text-[var(--primary)]"
                      : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="surface-card rounded-[1.5rem] p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-soft)]">
                Workspace
              </p>
              <p className="mt-3 font-[var(--font-display)] text-lg font-semibold text-[var(--foreground)]">
                Content pipeline
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Feeds, queue, schedule, and accounts in one place.
              </p>
            </div>

            <div className="space-y-1.5">
              {secondaryNavigation.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "surface-card text-[var(--primary)]"
                        : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
