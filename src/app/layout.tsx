/**
 * Root layout — wraps every route in the App Router.
 *
 * Responsibilities:
 *  - Imports the single global stylesheet (`globals.css`).
 *  - Declares site-wide `metadata` (SEO/OpenGraph) and `viewport` (theme color).
 *  - Renders the persistent chrome that lives on all pages: the fixed `Navbar`,
 *    the floating `ChatWidget`, and `ScrollToHash` (the headless controller that
 *    owns in-page smooth scrolling — see `lib/scroll.ts`).
 *
 * Note on fonts: body copy intentionally uses the native system sans-serif
 * stack (no web font is mapped to `font-family` here). The Hero loads Syne
 * locally for its own headings. See the README "Typography note".
 */
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ChatWidget from "@/components/layout/ChatWidget";
import Navbar from "@/components/layout/Navbar";
import ScrollToHash from "@/components/layout/ScrollToHash";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f9ff",
};

export const metadata: Metadata = {
  title: "Expendesk — Expense Intelligence Platform for Finance Teams",
  description:
    "Track expenses, automate reimbursements, enforce policies, and gain real-time visibility into company spending — all from one powerful platform built for SMEs.",
  keywords: ["expense management", "finance", "reimbursements", "SME", "expense tracking"],
  openGraph: {
    title: "Expendesk — Expense Intelligence Platform",
    description: "Control every business expense without the spreadsheet chaos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-black text-white min-h-screen">
        <Navbar />
        <ScrollToHash />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}