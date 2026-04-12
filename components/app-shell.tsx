"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { getNavigationItem } from "@/lib/navigation";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentItem = getNavigationItem(pathname);

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <AppSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
      <div className="min-h-screen lg:pl-72">
        <AppHeader
          title={currentItem.label}
          description={currentItem.description}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-14 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
