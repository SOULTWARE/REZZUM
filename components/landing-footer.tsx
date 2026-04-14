import Link from "next/link";
import { RezzumLogo } from "@/components/icons";

type LandingFooterProps = {
  id?: string;
};

const footerLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/about", label: "About" },
];

export function LandingFooter({ id }: Readonly<LandingFooterProps>) {
  return (
    <footer id={id} className="border-t border-[var(--ghost-line)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <RezzumLogo className="h-9 w-9" />
            <div>
              <p className="font-[var(--font-display)] text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                REZZUM
              </p>
              <p className="text-sm text-[var(--muted)]">
                RSS-to-social automation for modern teams.
              </p>
            </div>
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-5 text-sm text-[var(--muted)]">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
