"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <AppSidebar
        desktopCollapsed={desktopCollapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onToggleDesktopCollapse={() => setDesktopCollapsed((current) => !current)}
        pathname={pathname}
      />
      <div
        className={`min-h-screen transition-[padding] duration-200 ${
          desktopCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <AppHeader pathname={pathname} onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
