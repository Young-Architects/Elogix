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
import Script from "next/script";
import "./globals.css";
import { SITE_URL, GTM_ID } from "@/lib/site";
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
        {/* ── Google Tag Manager ──────────────────────────────────────────
            GTM ships as two snippets. This project has no index.html — this
            root layout wraps every route, so putting them here is the App
            Router equivalent of "on every page".

            Part 1, the loader. GTM's own instructions say "as high in <head>
            as possible", but that guidance predates frameworks: a blocking
            head script delays first paint. `next/script` with
            `afterInteractive` (Next's documented choice for tag managers)
            injects it right after hydration starts instead — GTM still fires
            on the initial pageview, without holding up render.

            `id` is required for inline scripts: it's how Next de-duplicates
            them across client-side navigations, so GTM initialises exactly
            once per session rather than on every route change. */}
        {GTM_ID && (
          <Script id="gtm-loader" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}

        {/* Part 2, the <noscript> fallback — must sit immediately inside
            <body> so it still renders for visitors with JavaScript disabled. */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}

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