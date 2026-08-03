/**
 * Root layout — wraps every route in the App Router.
 *
 * Responsibilities:
 *  - Imports the single global stylesheet (`globals.css`).
 *  - Declares site-wide `metadata` (SEO/OpenGraph) and `viewport` (theme color).
 *  - Renders the persistent chrome that lives on all pages: the fixed `Navbar`,
 *    the site-wide `Footer`, the floating `ChatWidget`, and `ScrollToHash` (the
 *    headless controller that owns in-page smooth scrolling — see `lib/scroll.ts`).
 *
 * Note on fonts: the entire site renders in Poppins. It is loaded here once via
 * `next/font/google`, which self-hosts the files at build time — so there is no
 * runtime request to Google and no layout shift. The font is exposed as the CSS
 * variable `--font-poppins` and wired into Tailwind's `--font-sans` in
 * globals.css, which is what makes every element inherit it.
 */
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { ChatProvider } from "@/components/chat/ChatProvider";
import ChatWidget from "@/components/layout/ChatWidget";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToHash from "@/components/layout/ScrollToHash";

/**
 * Poppins has no variable-font build on Google Fonts, so each weight is a
 * separate file and must be listed explicitly. These six are exactly the
 * weights the codebase uses (font-normal / medium / semibold / bold /
 * extrabold / black) — anything omitted would be faux-bolded by the browser,
 * which looks noticeably worse than the real cut.
 *
 * `display: "swap"` paints text immediately in the fallback and swaps in
 * Poppins on load, so copy is never invisible while the font downloads.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f9ff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Expendesk — Expense Intelligence Platform for Finance Teams",
    template: "%s — Expendesk",
  },
  description:
    "Track expenses, automate reimbursements, enforce policies, and gain real-time visibility into company spending — all from one powerful platform built for SMEs.",
  keywords: ["expense management", "finance", "reimbursements", "SME", "expense tracking"],
  // `images` is injected automatically from opengraph-image.tsx / twitter-image.tsx,
  // so it isn't repeated here.
  openGraph: {
    title: "Expendesk — Expense Intelligence Platform",
    description: "Control every business expense without the spreadsheet chaos.",
    url: SITE_URL,
    siteName: "Expendesk",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expendesk — Expense Intelligence Platform",
    description: "Control every business expense without the spreadsheet chaos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="antialiased bg-black text-white min-h-screen">
        <ChatProvider>
          <Navbar />
          <ScrollToHash />
          {children}
          <Footer />
          <ChatWidget />
        </ChatProvider>
      </body>
    </html>
  );
}