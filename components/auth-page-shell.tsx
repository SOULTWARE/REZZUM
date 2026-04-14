import Link from "next/link";
import { LinkedInIcon, RezzumLogo } from "@/components/icons";

type AuthField = {
  autoComplete?: string;
  label: string;
  name: string;
  placeholder: string;
  type?: "email" | "password" | "text";
};

type AuthPageShellProps = {
  alternateHref: string;
  alternateLabel: string;
  alternatePrompt: string;
  fields: AuthField[];
  submitLabel: string;
  subtitle: string;
  title: string;
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M21.6 12.23C21.6 11.55 21.54 10.9 21.43 10.27H12V14.14H17.39C17.16 15.39 16.45 16.45 15.39 17.16V19.67H18.62C20.51 17.93 21.6 15.37 21.6 12.23Z"
        fill="#4285F4"
      />
      <path
        d="M12 22C14.7 22 16.96 21.11 18.62 19.67L15.39 17.16C14.5 17.76 13.36 18.12 12 18.12C9.39 18.12 7.18 16.36 6.4 14H3.06V16.59C4.71 19.86 8.09 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.4 14C6.2 13.4 6.09 12.76 6.09 12C6.09 11.24 6.2 10.6 6.4 10V7.41H3.06C2.39 8.73 2 10.31 2 12C2 13.69 2.39 15.27 3.06 16.59L6.4 14Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.88C13.49 5.88 14.82 6.39 15.87 7.39L18.69 4.57C16.95 2.95 14.69 2 12 2C8.09 2 4.71 4.14 3.06 7.41L6.4 10C7.18 7.64 9.39 5.88 12 5.88Z"
        fill="#EA4335"
      />
    </svg>
  );
}

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
  fields,
  submitLabel,
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
            <form className="space-y-4">
              {fields.map((field) => (
                <label key={field.name} className="block">
                  <span className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
                    {field.label}
                  </span>
                  <input
                    autoComplete={field.autoComplete}
                    className="w-full rounded-[0.95rem] border border-[rgb(0_83_218_/_0.24)] bg-white px-4 py-4 text-[1.02rem] text-[var(--foreground)] shadow-[inset_0_1px_2px_rgb(16_24_40_/_0.04)] outline-none transition placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgb(0_83_218_/_0.12)]"
                    name={field.name}
                    placeholder={field.placeholder}
                    type={field.type ?? "text"}
                  />
                </label>
              ))}

              <button
                type="button"
                className="button-primary mt-3 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-lg font-semibold"
              >
                {submitLabel}
              </button>

              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-4 text-lg font-medium text-slate-600 shadow-[0_6px_14px_rgb(15_23_42_/_0.06)]"
              >
                <GoogleIcon />
                <span>{submitLabel === "Log in" ? "Sign in with Google" : "Sign up with Google"}</span>
              </button>

              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(145deg,var(--primary),var(--primary-strong))] px-6 py-4 text-lg font-medium text-white shadow-[0_14px_30px_rgb(0_83_218_/_0.22)]"
              >
                <LinkedInIcon className="h-5 w-5" />
                <span>
                  {submitLabel === "Log in" ? "Sign in with LinkedIn" : "Sign up with LinkedIn"}
                </span>
              </button>
            </form>

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
