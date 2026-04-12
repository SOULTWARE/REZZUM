export function PageContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex w-full min-w-0 flex-col gap-8">{children}</div>;
}
