import type { Metadata } from "next";
import { PageContainer } from "@/components/page-container";
import { getConnectedAccountOptions } from "@/server/accounts/service";
import { updateWorkspaceSettingsAction } from "@/server/settings/actions";
import { getWorkspaceSettings } from "@/server/settings/service";

export const metadata: Metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, linkedinAccounts, xAccounts] = await Promise.all([
    getWorkspaceSettings(),
    getConnectedAccountOptions("LINKEDIN"),
    getConnectedAccountOptions("X"),
  ]);

  return (
    <PageContainer>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <form action={updateWorkspaceSettingsAction} className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Workspace defaults
          </p>
          <h1 className="mt-3 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em] text-slate-900">
            Generation and delivery defaults
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            These values fill new feeds automatically and act as fallbacks when a feed does not
            override them.
          </p>

          <div className="mt-8 grid gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Default language
                </span>
                <input
                  name="defaultLanguage"
                  type="text"
                  defaultValue={settings.defaultLanguage}
                  className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Default feel
                </span>
                <input
                  name="defaultFeel"
                  type="text"
                  defaultValue={settings.defaultFeel}
                  className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Default style
              </span>
              <textarea
                name="defaultStyle"
                rows={6}
                defaultValue={settings.defaultStyle}
                className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm leading-7 text-slate-900"
              />
            </label>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Default LinkedIn destination
                </span>
                <select
                  name="defaultLinkedInAccountId"
                  defaultValue={settings.defaultLinkedInAccountId ?? ""}
                  className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
                >
                  <option value="">No default destination</option>
                  {linkedinAccounts.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Default X destination
                </span>
                <select
                  name="defaultXAccountId"
                  defaultValue={settings.defaultXAccountId ?? ""}
                  className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
                >
                  <option value="">No default destination</option>
                  {xAccounts.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Default auto-publish interval (minutes)
              </span>
              <input
                name="defaultAutoPublishIntervalMinutes"
                type="number"
                min={15}
                defaultValue={settings.defaultAutoPublishIntervalMinutes ?? ""}
                className="w-full rounded-lg bg-[var(--surface-low)] px-4 py-3 text-sm text-slate-900"
              />
            </label>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="button-primary inline-flex items-center rounded-lg px-5 py-3 text-sm font-semibold"
            >
              Save workspace defaults
            </button>
          </div>
        </form>

        <aside className="grid gap-6">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Automation
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.03em] text-slate-900">
              Cron endpoints
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-500">
              <p>
                Feed polling: <code>/api/cron/feeds</code>
              </p>
              <p>
                Due publishes: <code>/api/cron/publish</code>
              </p>
              <p>
                Both cron endpoints accept <code>GET</code> and <code>POST</code>.
              </p>
              <p>
                Local development uses the built-in cron worker from <code>pnpm dev</code>.
              </p>
              <p>
                Linux and AWS deployments should run <code>pnpm cron:worker</code> as a separate
                background process.
              </p>
              <p>
                Send <code>Authorization: Bearer $CRON_SECRET</code> only if you use the HTTP cron
                endpoints.
              </p>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Notes
            </p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-500">
              <p>LinkedIn connections import company pages the authenticated member can publish as.</p>
              <p>X uses OAuth 2.0 PKCE and stores the connected account for direct publishing.</p>
              <p>Feed-specific settings override these defaults whenever they are present.</p>
            </div>
          </section>
        </aside>
      </section>
    </PageContainer>
  );
}
