"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { MenuCloseIcon, RezzumLogo, SettingsIcon } from "@/components/icons";
import { primaryNavigation, secondaryNavigation } from "@/lib/navigation";

type AppSidebarProps = {
  desktopCollapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  onToggleDesktopCollapse: () => void;
  pathname: string;
  user: {
    email: string;
    image?: string | null;
    name: string;
  };
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const sidebarSecondaryNavigation = secondaryNavigation.filter((item) => item.href !== "/settings");

export function AppSidebar({
  desktopCollapsed,
  mobileOpen,
  onClose,
  onToggleDesktopCollapse,
  pathname,
  user,
}: Readonly<AppSidebarProps>) {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  useEffect(() => {
    setIsAccountModalOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      setIsAccountModalOpen(false);
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!isAccountModalOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountModalOpen]);

  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[rgb(42_52_57_/_0.16)] backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      {isAccountModalOpen ? (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsAccountModalOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/70 bg-slate-50 px-4 py-4 transition-[width,transform,padding] duration-200 lg:translate-x-0 ${
          desktopCollapsed ? "lg:w-20 lg:px-3" : "lg:w-64 lg:px-4"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`mb-8 flex items-center justify-between px-2 py-4 ${
            desktopCollapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.innerWidth >= 1024) {
                onToggleDesktopCollapse();
                return;
              }

              onClose();
            }}
            aria-label={desktopCollapsed ? "Expand navigation" : "Collapse navigation"}
            title={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex items-center rounded-2xl ${
              desktopCollapsed ? "gap-3 lg:justify-center lg:gap-0" : "gap-3"
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
              <RezzumLogo className="h-9 w-9" />
            </div>
            <div className={`text-left ${desktopCollapsed ? "lg:hidden" : ""}`}>
              <p className="font-[var(--font-display)] text-lg font-bold tracking-[-0.03em] text-slate-900">
                REZZUM
              </p>
              <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                RSS to social
              </p>
            </div>
          </button>
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
                  title={desktopCollapsed ? label : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    desktopCollapsed ? "lg:justify-center" : ""
                  } ${
                    isActive
                      ? "bg-white text-[var(--primary)] shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className={desktopCollapsed ? "lg:hidden" : ""}>{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1.5">
            {sidebarSecondaryNavigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  title={desktopCollapsed ? label : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    desktopCollapsed ? "lg:justify-center" : ""
                  } ${
                    isActive
                      ? "bg-white text-[var(--primary)] shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className={desktopCollapsed ? "lg:hidden" : ""}>{label}</span>
                </Link>
              );
            })}

            <div className="relative mt-4 border-t border-slate-200/70 pt-4">
              {isAccountModalOpen ? (
                <section
                  role="menu"
                  aria-label="Account menu"
                  className={`absolute bottom-[calc(100%+0.6rem)] z-[60] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_20px_48px_rgb(15_23_42_/_0.18)] ${
                    desktopCollapsed
                      ? "left-0 w-[min(17rem,calc(100vw-2rem))] lg:w-60"
                      : "left-0 right-0"
                  }`}
                >
                  <div className="grid gap-1">
                    <Link
                      role="menuitem"
                      href="/settings"
                      onClick={() => {
                        setIsAccountModalOpen(false);
                        onClose();
                      }}
                      className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900"
                    >
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      Settings
                    </Link>

                    <LogoutButton />
                  </div>
                </section>
              ) : null}
              <button
                type="button"
                onClick={() => setIsAccountModalOpen((current) => !current)}
                className={`flex w-full items-center rounded-2xl px-2 py-2 text-left transition-colors hover:bg-white ${
                  desktopCollapsed ? "gap-3 lg:justify-center lg:gap-0" : "gap-3"
                }`}
                aria-haspopup="menu"
                aria-expanded={isAccountModalOpen}
                aria-label="Open account menu"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-700 shadow-sm">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className={`min-w-0 ${desktopCollapsed ? "lg:hidden" : ""}`}>
                  <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                </div>
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
