export function PageContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">{children}</div>;
}
