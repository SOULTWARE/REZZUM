"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    email: string;
    image?: string | null;
    name: string;
  };
};

export function AppShell({ children, user }: Readonly<AppShellProps>) {
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
        user={user}
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
