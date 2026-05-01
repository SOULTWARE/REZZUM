"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { hasPageWalkthrough, OnboardingTour } from "@/components/onboarding-tour";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    email: string;
    image?: string | null;
    name: string;
  };
};

const ONBOARDING_STORAGE_VERSION = "v1";
type WalkthroughScope = "full" | "page";

function getOnboardingStorageKey(email: string) {
  return `rezzum:onboarding:${ONBOARDING_STORAGE_VERSION}:${email.toLowerCase()}`;
}

function getPageOnboardingStorageKey(email: string, pathname: string) {
  const normalizedPathname = pathname.replace(/\/[a-z0-9_-]{16,}(?=\/|$)/gi, "/detail");

  return `rezzum:onboarding-page:${ONBOARDING_STORAGE_VERSION}:${email.toLowerCase()}:${normalizedPathname}`;
}

export function AppShell({ children, user }: Readonly<AppShellProps>) {
  const pathname = usePathname() ?? "/dashboard";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [walkthroughRun, setWalkthroughRun] = useState(false);
  const [walkthroughKey, setWalkthroughKey] = useState(0);
  const [walkthroughScope, setWalkthroughScope] = useState<WalkthroughScope>("full");
  const autoStartAttemptedRef = useRef(false);

  const onboardingStorageKey = getOnboardingStorageKey(user.email);
  const pageOnboardingStorageKey = getPageOnboardingStorageKey(user.email, pathname);

  const startWalkthrough = useCallback((scope: WalkthroughScope = "full") => {
    setDesktopCollapsed(false);
    setMobileOpen(scope === "full" && typeof window !== "undefined" && window.innerWidth < 1024);
    setWalkthroughScope(scope);
    setWalkthroughRun(false);
    setWalkthroughKey((current) => current + 1);

    window.setTimeout(() => {
      setWalkthroughRun(true);
    }, 260);
  }, []);

  const finishWalkthrough = useCallback(() => {
    setWalkthroughRun(false);

    try {
      if (walkthroughScope === "full") {
        window.localStorage.setItem(onboardingStorageKey, "completed");
      }

      if (hasPageWalkthrough(pathname)) {
        window.localStorage.setItem(pageOnboardingStorageKey, "completed");
      }
    } catch {
      // Browsers can block localStorage in private or restricted contexts.
    }
  }, [onboardingStorageKey, pageOnboardingStorageKey, pathname, walkthroughScope]);

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

  useEffect(() => {
    if (walkthroughRun || !hasPageWalkthrough(pathname)) {
      return;
    }

    try {
      if (
        !window.localStorage.getItem(onboardingStorageKey) ||
        window.localStorage.getItem(pageOnboardingStorageKey)
      ) {
        return;
      }
    } catch {
      return;
    }

    const timer = window.setTimeout(() => startWalkthrough("page"), 650);

    return () => window.clearTimeout(timer);
  }, [onboardingStorageKey, pageOnboardingStorageKey, pathname, startWalkthrough, walkthroughRun]);

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
        pathname={pathname}
        run={walkthroughRun}
        scope={walkthroughScope}
        tourKey={walkthroughKey}
      />
    </div>
  );
}
