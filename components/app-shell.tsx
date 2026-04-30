"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { OnboardingTour } from "@/components/onboarding-tour";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    email: string;
    image?: string | null;
    name: string;
  };
};

const ONBOARDING_STORAGE_VERSION = "v1";

function getOnboardingStorageKey(email: string) {
  return `rezzum:onboarding:${ONBOARDING_STORAGE_VERSION}:${email.toLowerCase()}`;
}

export function AppShell({ children, user }: Readonly<AppShellProps>) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [walkthroughRun, setWalkthroughRun] = useState(false);
  const [walkthroughKey, setWalkthroughKey] = useState(0);
  const autoStartAttemptedRef = useRef(false);

  const onboardingStorageKey = getOnboardingStorageKey(user.email);

  const startWalkthrough = useCallback(() => {
    setDesktopCollapsed(false);
    setMobileOpen(typeof window !== "undefined" && window.innerWidth < 1024);
    setWalkthroughRun(false);
    setWalkthroughKey((current) => current + 1);

    window.setTimeout(() => {
      setWalkthroughRun(true);
    }, 260);
  }, []);

  const finishWalkthrough = useCallback(() => {
    setWalkthroughRun(false);

    try {
      window.localStorage.setItem(onboardingStorageKey, "completed");
    } catch {
      // Browsers can block localStorage in private or restricted contexts.
    }
  }, [onboardingStorageKey]);

  useEffect(() => {
    if (autoStartAttemptedRef.current) {
      return;
    }

    autoStartAttemptedRef.current = true;

    try {
      if (window.localStorage.getItem(onboardingStorageKey)) {
        return;
      }
    } catch {
      return;
    }

    const timer = window.setTimeout(startWalkthrough, 700);

    return () => window.clearTimeout(timer);
  }, [onboardingStorageKey, startWalkthrough]);

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <AppSidebar
        desktopCollapsed={desktopCollapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onStartWalkthrough={startWalkthrough}
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
        <main
          data-onboarding="app-main"
          className="px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8"
        >
          {children}
        </main>
      </div>
      <OnboardingTour
        key={walkthroughKey}
        onFinish={finishWalkthrough}
        run={walkthroughRun}
        tourKey={walkthroughKey}
      />
    </div>
  );
}
