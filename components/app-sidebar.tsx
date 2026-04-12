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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/70 bg-slate-50 px-4 py-4 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2 py-4">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div>
              <p className="font-[var(--font-display)] text-lg font-bold tracking-[-0.03em] text-slate-900">
                REZZUM
              </p>
              <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                AI curator
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm lg:hidden"
            aria-label="Close navigation"
          >
            <MenuCloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-between">
          <div className="space-y-1.5">
            {primaryNavigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-white text-[var(--primary)] shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1.5">
            {secondaryNavigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-white text-[var(--primary)] shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              );
            })}

            <div className="mt-4 border-t border-slate-200/70 pt-4">
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <RezzumLogo className="h-8 w-8" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    Default workspace
                  </p>
                  <p className="truncate text-[11px] text-slate-500">MVP preview</p>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
