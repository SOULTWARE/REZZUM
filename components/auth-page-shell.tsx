import Link from "next/link";
import { RezzumLogo } from "@/components/icons";

type AuthPageShellProps = {
  alternateHref: string;
  alternateLabel: string;
  alternatePrompt: string;
  children: React.ReactNode;
  subtitle: string;
  title: string;
};

function CornerWaves({
  className,
  flipX = false,
  flipY = false,
}: Readonly<{ className: string; flipX?: boolean; flipY?: boolean }>) {
  const transforms = `${flipX ? " scaleX(-1)" : ""}${flipY ? " scaleY(-1)" : ""}`;

  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 220 220"
        className="h-full w-full"
        fill="none"
        style={{ transform: transforms.trim() || undefined }}
      >
        <path
          d="M-16 78C34 78 34 18 84 18H176C212 18 220 -12 220 -32"
          stroke="rgb(0 83 218 / 0.38)"
          strokeWidth="2"
        />
        <path
          d="M-8 132C52 132 52 48 112 48H186C216 48 224 18 224 -18"
          stroke="rgb(0 83 218 / 0.38)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export function AuthPageShell({
  alternateHref,
  alternateLabel,
  alternatePrompt,
  children,
  subtitle,
  title,
}: Readonly<AuthPageShellProps>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fafdff_0%,#f2f6fb_42%,#eef3f8_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgb(0_83_218_/_0.08),transparent_22%),radial-gradient(circle_at_82%_24%,rgb(0_72_193_/_0.07),transparent_20%),radial-gradient(circle_at_50%_52%,rgb(255_255_255_/_0.92),transparent_46%),radial-gradient(circle_at_78%_86%,rgb(0_83_218_/_0.08),transparent_24%),radial-gradient(circle_at_16%_84%,rgb(0_83_218_/_0.06),transparent_20%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-3xl"
      />
      <CornerWaves className="absolute left-0 top-0 h-28 w-28 sm:h-40 sm:w-40" />
      <CornerWaves
        className="absolute bottom-0 right-0 h-28 w-28 sm:h-40 sm:w-40"
        flipX
        flipY
      />

      <main className="relative flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
        <section className="w-full max-w-[31rem] rounded-[1.75rem] border border-white/75 bg-white/92 p-8 shadow-[0_30px_80px_rgb(44_62_80_/_0.14),0_10px_26px_rgb(44_62_80_/_0.08)] backdrop-blur-md sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <RezzumLogo className="h-12 w-12 rounded-2xl" />
              <div className="text-left">
                <p className="font-[var(--font-display)] text-[2rem] font-semibold leading-none tracking-[-0.05em] text-[var(--primary)]">
                  REZZUM
                </p>
                <p className="mt-1 text-[0.8rem] font-medium text-[var(--muted)]">{subtitle}</p>
              </div>
            </Link>

            <h1 className="mt-8 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-[2.65rem]">
              {title}
            </h1>
          </div>

          <section className="mt-9">
            {children}

            <p className="mt-8 text-center text-[1.05rem] text-[var(--foreground)]">
              {alternatePrompt}{" "}
              <Link href={alternateHref} className="font-semibold text-[var(--primary)]">
                {alternateLabel}
              </Link>
            </p>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[var(--muted)]">
              <Link href="/privacy" className="hover:text-[var(--primary)]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[var(--primary)]">
                Terms of Service
              </Link>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
