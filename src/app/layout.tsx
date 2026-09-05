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
import {
  SITE_URL,
  SITE_NAME,
  GTM_ID,
  IS_INDEXABLE_DEPLOY,
  GOOGLE_SITE_VERIFICATION,
} from "@/lib/site";
import { siteStructuredData, jsonLd } from "@/lib/structured-data";
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
    "Expendesk is an expense intelligence platform for finance teams. Track expenses, automate reimbursements, enforce spend policies, and get real-time visibility into company spending — built for SMEs and mid-market businesses.",
  applicationName: SITE_NAME,
  /**
   * Stops iOS Safari auto-linking any digit string that looks like a phone
   * number. Without it Safari turns figures in marketing copy — "94%",
   * "3x", plan prices, dates — into blue tappable telephone links, which is
   * both visually broken and a dead tap target.
   *
   * The real contact number is still reachable: it lives in the Organization
   * JSON-LD and in explicit `tel:` links, neither of which this affects.
   */
  formatDetection: { telephone: false },
  /**
   * A clean, unhashed `rel="shortcut icon"` pointing at the root favicon.
   *
   * Next's file conventions (src/app/favicon.ico, icon0/1/2.png) already emit
   * `<link rel="icon">` tags, but every one of them carries a content-hash
   * query string:
   *
   *     <link rel="icon" href="/favicon.ico?favicon.0zo1q079966bd.ico" ...>
   *
   * That hash is stable (it is derived from the file's contents, verified
   * unchanged across rebuilds) and browsers handle it fine. But it means the
   * home page offered Google no plain, canonical favicon URL — and
   * `/favicon.ico` at the document root is the oldest and most universally
   * honoured convention there is, the one every crawler falls back to.
   *
   * This adds that link explicitly. It costs one tag, can never go stale, and
   * removes any dependence on a third party parsing a query-stringed icon URL
   * correctly.
   *
   * ── Why every icon is listed here rather than left to the file convention ──
   *
   * Declaring `metadata.icons` at all *overrides* Next's file-based icon tags
   * (verified: adding only `shortcut` silently dropped icon0/icon1/icon2 and the
   * apple-touch-icon from the rendered head, leaving just two links). So the set
   * has to be declared in full or not at all.
   *
   * Listing them explicitly is the better half of that trade, because it also
   * removes the hash from every icon URL. Each path is served by the same
   * file-convention files in src/app/ and resolves cleanly (all verified 200),
   * so nothing moves — the URLs just become permanently stable, which is what
   * Google asks for and what a hashed URL can never quite promise.
   *
   * The trade-off is browser caching: without the hash, a changed icon may be
   * served stale from cache for a while. That is the correct trade for a
   * favicon — a stable URL matters more than instant propagation, and the
   * `sizes` attributes still let browsers pick the right file.
   *
   * Sizes must match the real pixel dimensions of each file. They are generated
   * by scripts/generate-icons.mjs; if you change a size there, change it here.
   */
  icons: {
    icon: [
      { url: "/icon0.png", sizes: "16x16", type: "image/png" },
      { url: "/icon1.png", sizes: "32x32", type: "image/png" },
      // 192x192 (48x4) exists for Google Search, which asks for a square that
      // is a multiple of 48px and otherwise had only the .ico's 48 to work from.
      { url: "/icon2.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Names the publisher on the page itself, reinforcing the same brand string
  // the Organization JSON-LD asserts.
  authors: [{ name: SITE_NAME, url: `${SITE_URL}/` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // NOTE: `alternates.canonical` is deliberately NOT set here. Metadata is
  // merged shallowly from the root layout downwards, so a canonical set at
  // this level would be inherited by every page that doesn't override it —
  // pointing the whole site at "/" and de-indexing each real page in favour of
  // the home page. Canonicals are declared per route instead.
  //
  // Explicit crawl directives. Without `max-snippet` / `max-image-preview`,
  // Google applies conservative defaults; `large` is what makes a result
  // eligible for the big thumbnail treatment. `IS_INDEXABLE_DEPLOY` flips the
  // whole site to noindex on preview builds so a *.vercel.app copy can never
  // compete with the real domain for the same content.
  robots: IS_INDEXABLE_DEPLOY
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : { index: false, follow: false },
  // Search Console ownership. Emits nothing when the token is unset, since an
  // empty verification tag fails verification rather than being ignored.
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  // `images` is injected automatically from opengraph-image.tsx / twitter-image.tsx,
  // so it isn't repeated here.
  openGraph: {
    title: "Expendesk — Expense Intelligence Platform for Finance Teams",
    description:
      "Control every business expense without the spreadsheet chaos. Expense tracking, automated reimbursements and real-time spend visibility in one platform.",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expendesk — Expense Intelligence Platform for Finance Teams",
    description:
      "Control every business expense without the spreadsheet chaos. Expense tracking, automated reimbursements and real-time spend visibility in one platform.",
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
        {/* ── Brand entity graph (JSON-LD) ─────────────────────────────────
            Organization + WebSite + SoftwareApplication, cross-linked by @id.
            This is what tells Google that the string "Expendesk" names a real
            company that owns this domain — the signal whose absence makes the
            engine offer "Showing results for spendesk" instead. See
            lib/structured-data.ts for the reasoning and docs/SEO.md for how to
            validate it.

            Rendered as a script tag in the layout body, which is Next's
            documented recommendation for JSON-LD (it is valid in either <head>
            or <body>, and crawlers read both). `dangerouslySetInnerHTML` is
            required because the payload must reach the document as raw script
            text — React would otherwise escape the quotes into invalid JSON.
            The content is developer-authored and passed through `jsonLd()`,
            which escapes angle brackets so no value can break out of the
            script element. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(siteStructuredData()) }}
        />
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