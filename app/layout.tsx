import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "REZZUM",
    template: "%s | REZZUM",
  },
  description:
    "REZZUM turns RSS feeds into reviewable, schedulable social media drafts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} min-h-full antialiased`}
    >
      <body className="min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
