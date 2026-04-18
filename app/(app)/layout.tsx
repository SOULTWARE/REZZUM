import { requireAuthSession } from "@/server/auth/session";
import { AppShell } from "@/components/app-shell";

export default async function ShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAuthSession();

  return (
    <AppShell
      user={{
        email: session.user.email,
        name: session.user.name || session.user.email,
      }}
    >
      {children}
    </AppShell>
  );
}
