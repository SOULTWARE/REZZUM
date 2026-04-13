"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RezzumLogo } from "@/components/icons";

type NavLink = {
  href: string;
  label: string;
};

type LandingHeaderProps = {
  primaryNavLinks: NavLink[];
};

export function LandingHeader({ primaryNavLinks }: Readonly<LandingHeaderProps>) {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`sticky z-40 ${isAtTop ? "top-0" : "top-4 px-4 sm:px-6 lg:px-8"}`}>
      <div
        className={`flex w-full items-center justify-between py-3 ${
          isAtTop
            ? "border-b border-slate-200/70 bg-white/55 px-4 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/45 sm:px-6 lg:px-8"
            : "surface-panel mx-auto max-w-7xl rounded-xl border border-slate-200/70 bg-white/55 px-4 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/45 sm:px-5"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
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

        <div className="ml-auto flex items-center gap-6">
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {primaryNavLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <Link
            href="/dashboard"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline-flex"
          >
            Open app
          </Link>
          <Link
            href="/dashboard"
            className="button-primary inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
