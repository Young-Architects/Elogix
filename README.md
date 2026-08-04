# Expendesk — Landing Page

**Live site:** https://expendesk-v1.vercel.app/

Marketing landing page for **Expendesk**, an expense intelligence platform built for finance teams and SMEs. A single long-form home page composed of independent, animated sections, a set of per-industry solution pages, an AI chat widget, a **headless-WordPress blog** at `/resources/blogs`, and two **GoHighLevel-powered conversion pages** — a demo-booking calendar at `/contact-us` and a contact form at `/contact-sales`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 (most of the site) + GSAP 3 / ScrollTrigger (pharmaceutical scroll sequences) + hand-written CSS keyframes |
| Icons | Lucide React |
| Fonts | Poppins (400/500/600/700/800/900) self-hosted via `next/font/google`, applied site-wide |
| Content | Headless WordPress ("Blog to JSON" plugin) for `/resources/blogs`; all marketing copy in local JSON/TS data files |
| Lead capture & booking | GoHighLevel (LeadConnector) embedded booking calendar + contact form, auto-sized by GHL's `form_embed.js` |
| Runtime | React 19 |

Only the libraries actually imported by the app are kept as dependencies: `next`, `react`, `react-dom`, `framer-motion`, `lucide-react`, `gsap` (pharmaceutical section components, via `ScrollTrigger`), plus `clsx` + `tailwind-merge` behind the `cn()` helper (currently unused, kept available for shadcn-style components). No UI-kit or particle packages are pulled in.

---

## Project Structure

```
logo.png                            # SOURCE brand artwork (flat background) — processed copies live in public/
src/
├── app/
│   ├── globals.css                 # Single source of truth for global CSS + @keyframes (incl. .blog-content typography)
│   ├── layout.tsx                  # Root layout: global metadata (metadataBase, title template); ChatProvider wraps Navbar + ScrollToHash + Footer + ChatWidget
│   ├── page.tsx                    # Home page composition (above-fold static, below-fold lazy)
│   ├── robots.ts                   # robots.txt (allow all, disallow /api/) + sitemap pointer
│   ├── sitemap.ts                  # sitemap.xml: static routes + every published blog post (from the WP API)
│   ├── api/
│   │   ├── chat/route.ts           # POST endpoint the Expy AI chat widget talks to
│   │   └── revalidate/route.ts     # POST webhook: WordPress → on-demand ISR purge (secret-guarded)
│   ├── contact-us/                 # "Book a Demo" page — every demo CTA on the site lands here
│   │   ├── _components/            # BookingCalendarSection (hero copy + embedded GHL booking calendar + loader)
│   │   ├── _data/content.ts        # Page copy + GHL calendar embed config (IDs/URLs) + loading label
│   │   └── page.tsx
│   ├── contact-sales/              # Contact page — the navbar/footer "Contact" target
│   │   ├── _components/            # ContactSalesSection (intro + layout) · GhlContactForm (embedded GHL form + loader)
│   │   ├── _data/content.ts        # Page copy + GHL form embed config (IDs/URLs) + alternative-route links
│   │   └── page.tsx
│   ├── pricing/                    # Plans page from the GTM sheet (placeholder prices flagged in _data)
│   │   ├── _components/            # PricingHeroSection · PricingPlansSection · PricingFaqSection · PricingFinalCtaSection
│   │   ├── _data/content.ts        # ALL pricing copy: hero, plan cards, FAQ, final CTA ("Book a Free Demo" → /contact-us)
│   │   └── page.tsx
│   ├── solutions/                  # Per-industry SEO landing pages (copy in each page's _data/)
│   │   ├── _data/content.ts        # Copy for the hub placeholder (<ComingSoon />)
│   │   ├── page.tsx                # /solutions hub index → <ComingSoon />
│   │   ├── digital-agencies/
│   │   │   ├── _data/content.ts    # Page copy
│   │   │   └── page.tsx
│   │   ├── manufacturing/
│   │   │   ├── _data/content.ts    # Page copy
│   │   │   └── page.tsx
│   │   └── pharmaceutical/         # Built section-by-section (route-private _ folders)
│   │       ├── _components/        # One component per section (presentation only)
│   │       │   ├── HeroSection.tsx                 # Split-hero: copy + docked AI chat
│   │       │   ├── ProblemSection.tsx              # Impact stats, MR chips, legacy-tool + consequence carousels
│   │       │   ├── SelfAssessmentSection.tsx       # Interactive 60-sec audit checklist + live score ring
│   │       │   ├── ChecklistIntroSection.tsx       # Lead magnet: audience chips + animated checklist-preview card
│   │       │   ├── BridgeSection.tsx               # "How do you fix them?": challenge cards + mobile marquee
│   │       │   ├── IntroducingExpendeskSection.tsx # Product reveal: auto-cycling capability cards + CTA banner
│   │       │   ├── ChecklistContentsSection.tsx    # "What's inside": category timeline / tile grid + locked card
│   │       │   ├── Choosenextstepsection.tsx        # Dual-CTA cards (MagneticButton) + dark trust capsule
│   │       │   └── FinalCtaSection.tsx              # Closing CTA: two action panels (MagneticButton) on dark bg
│   │       ├── _data/              # One file per section — ALL copy + data (nothing inline)
│   │       │   ├── index.ts                  # Barrel: groups sections into `content`, re-exports each + types
│   │       │   ├── types.ts                  # Shared interfaces (HeroContent, ProblemContent, …, FinalCtaContent)
│   │       │   └── hero · problem · self-assessment · checklist-intro · bridge ·
│   │       │       introducing-expendesk · checklist-contents · choose-next-step · final-cta .ts
│   │       └── page.tsx            # Composes the sections in order
│   ├── resources/                  # Resources dropdown routes
│   │   ├── _data/content.ts        # Copy for the hub placeholder (<ComingSoon />)
│   │   ├── page.tsx                # /resources hub index → <ComingSoon />
│   │   ├── blogs/                  # Headless-WordPress blog (see "Blog" section below)
│   │   │   ├── layout.tsx          # Light-theme white canvas wrapper for all blog routes
│   │   │   ├── loading.tsx         # Skeleton for the listing (hero + featured + grid)
│   │   │   ├── page.tsx            # Listing: hero → featured post → card grid → pagination (+ ?category filter)
│   │   │   ├── [slug]/             # Individual post — SSG at build + on-demand for new posts
│   │   │   │   ├── page.tsx        # Article + sticky sidebar, OpenGraph/Twitter meta, JSON-LD
│   │   │   │   └── not-found.tsx   # Per-post 404
│   │   │   ├── _components/        # BlogCard · FeaturedPost · BlogContent · BlogSidebar · BlogPagination · ShareLinks
│   │   │   └── _data/content.ts    # All blog UI copy (labels, CTA, empty/error states)
│   │   ├── case-studies/           # Not built yet → <ComingSoon /> (copy in _data/content.ts, noindex)
│   │   ├── whitepapers/            # Not built yet → <ComingSoon /> (copy in _data/content.ts, noindex)
│   │   └── faqs/                   # Legacy route → redirect() to the on-page /#faq section
│
├── components/
│   ├── chat/                       # Expy AI chat — shared state, two render targets (copy in src/data/chat.json)
│   │   ├── ChatProvider.tsx        # Context: conversation state, webhook, dock handoff
│   │   ├── ChatPanel.tsx           # Shared panel UI (docked + floating variants)
│   │   └── HeroChatDock.tsx        # One-line drop-in slot for a hero's right column
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky pill nav, brand logo (public/logo.png), animated dropdowns, scroll progress bar
│   │   ├── ChatWidget.tsx          # Floating launcher + panel (hidden while a hero dock is in view)
│   │   ├── Footer.tsx              # Dark footer: white brand logo, link columns, social dock, legal bar
│   │   └── ScrollToHash.tsx        # Single owner of in-page hash smooth-scrolling
│   ├── sections/                   # Home-page sections, in visual page order (see page.tsx)
│   │   ├── HeroSection.tsx         # Canvas dot grid, animated counters; docks the AI chat on the right
│   │   ├── ProblemSection.tsx      # SVG cause→chaos→effect connector diagram
│   │   ├── SolutionSection.tsx     # Node/beam diagram, feature carousel, dashboard preview
│   │   ├── BenefitsSection.tsx     # Bento grid (desktop) / swipeable carousel (mobile)
│   │   ├── FeaturesVideo.tsx       # 3D tilt card + scrollable, data-driven industry selector
│   │   ├── HowItWorksSection.tsx   # 3-step "get started" flow (arrow chips desktop / ↓ stack mobile)
│   │   ├── LeadMagnetSection.tsx   # 3D guide cover, download CTA
│   │   ├── ComparisonSection.tsx   # "Traditional vs Expendesk" versus card (spinning beam + VS badge)
│   │   ├── TestimonialsSection.tsx # Dual infinite marquee rows
│   │   ├── FaqSection.tsx          # Single-open accordion + FAQPage JSON-LD ("Contact Us" CTA → /contact-sales)
│   │   └── WhyExpendesk.tsx        # Before/after comparison + closing dark CTA panel
│   └── ui/
│       ├── MagneticButton.tsx      # Shared magnetic CTA (cursor-follow, gradient variants)
│       ├── ComingSoon.tsx          # Shared placeholder page body (page copy via props; badge/CTA copy in src/data/coming-soon.json)
│       ├── ComingSoonSection.tsx   # Inline "coming soon" banner for partially built pages (manufacturing / digital-agencies)
│       ├── GhlEmbedLoader.tsx      # Branded loading overlay for the GHL embeds (spinner ring + brand mark + label)
│       └── ScrollBeamDivider.tsx   # Shared animated section divider
│
├── data/
│   ├── navigation.json             # Navbar brand (logo src/alt), links, dropdowns, Login + "Book a Demo" CTA (→ /contact-us)
│   ├── footer.json                 # Footer brand (logo src/alt, blurb), link columns, socials, legal
│   ├── chat.json                   # ALL AI-chat copy: greeting, quick questions, error, labels, aria strings
│   ├── coming-soon.json            # Shared <ComingSoon /> copy: badge + primary/secondary CTA
│   ├── README.md                   # Section ↔ component ↔ anchor map + content conventions
│   └── sections/                   # One JSON file per home section (all copy lives here), in page order:
│       └── hero · problem · solution · benefits · features · how-it-works · lead-magnet · comparison · testimonials · faq · why-expendesk .json
│
├── hooks/
│   └── use-ghl-embed-loaded.ts     # Detects when a GHL iframe's widget has really loaded (drives the loading overlays)
│
├── lib/
│   ├── blog-api.ts                 # Server data layer for the WP Blog-to-JSON API (ISR, cache tags, helpers)
│   ├── site.ts                     # SITE_URL — canonical origin for metadata/sitemap/canonicals
│   ├── scroll.ts                   # Layout-shift-aware smooth-scroll engine for hash links
│   └── utils.ts                    # cn() helper (clsx + tailwind-merge; currently unused, kept for future components)
│
└── types/
    ├── blog.ts                     # Blog-to-JSON API schema (ContentBlock union, BlogPost, list response)
    └── index.ts                    # Shared TypeScript interfaces (Testimonial, Chat*, Why*)

public/
├── logo.png                        # Brand lockup, transparent bg (used by the Navbar) — processed from root logo.png
├── logo-white.png                  # White-text variant for dark surfaces (used by the Footer)
├── placeholder-ebook.pdf           # PLACEHOLDER lead-magnet guide — swap for the real PDF before launch
└── downloads/
    └── pharma-expense-audit-checklist-demo.pdf   # PLACEHOLDER pharma checklist — swap before launch

wordpress/
└── blog-to-json-webhook.php        # WP plugin: pings /api/revalidate on publish/update/delete (install on the WP site)
```

---

## Conversion Flow — Book a Demo & Contact

The site has two conversion destinations, both powered by embedded GoHighLevel (GHL / LeadConnector) widgets:

| Intent | Route | Widget | Reached from |
|---|---|---|---|
| **Book a demo** | `/contact-us` | GHL **booking calendar** | Navbar "Book a Demo" CTA, home hero, every section demo CTA, pricing "Book a Free Demo" (×5), solutions CTAs, blog sidebar, footer "Book a Demo" |
| **Contact / questions** | `/contact-sales` | GHL **contact form** ("Contact Expendesk") | Navbar + footer "Contact", FAQ "Contact Us" CTA, blog "Talk to our team" |

The two pages **cross-link**: the form page offers "Prefer a live walkthrough? Book a demo" (+ a `mailto:info@expendesk.com` link), and the calendar page offers "Not ready to book? Talk to a market specialist" — so no visitor dead-ends.

Bookings and form submissions land directly in the GHL account (Calendars / Form Submissions). There is **no custom form or webhook code** on the site for lead capture.

---

## GHL Embeds — configuration & sizing system

Both widgets are plain `<iframe>` embeds auto-sized by GHL's companion script (`form_embed.js`, loaded once per page via `next/script`). All embed identifiers live in data files — **to swap a calendar or form, edit only these**:

- **Calendar** → [`src/app/contact-us/_data/content.ts`](src/app/contact-us/_data/content.ts) → `bookingCalendar` (`src`, `iframeId`)
- **Form** → [`src/app/contact-sales/_data/content.ts`](src/app/contact-sales/_data/content.ts) → `salesFormEmbed` (`src`, `formId`, `iframeId`, `title`, `dataHeight`)

When grabbing new embed code in GHL, use layout type **Inline** with *Always show / Always activated / Never deactivate* (the `data-*` attributes the components render).

### Sizing rules (measured against the live widgets — read before touching)

The GHL widgets are cross-origin, so their internals can't be styled. The components compensate from outside; every constant below was measured, not guessed:

1. **The script owns the iframe height.** `form_embed.js` sets an inline `style.height` from the widget's postMessage. Never put a *large* CSS `min-height` on the iframe — CSS min-height beats inline height and pads the card with dead space. Small `min-h-[420px]` values exist only as boot fallbacks (and on the cards, because the script briefly collapses the iframe during boot).
2. **Anti-scroll height buffer (form).** The inner form document can end up slightly taller than the height it reports (fonts, zoom rounding), making the form scrollable *inside* the iframe. A `MutationObserver` in `GhlContactForm` re-adds **+60px** on top of every height the script sets, so the inner document always fits and nothing can scroll.
3. **Dead-padding crops (form).** The form document bakes in whitespace that varies with its internal layout mode (by iframe width): `<~480px` → 135px above the first field / 148px below the submit button; `~500–600px` → 95/108; `≥~650px` (two-column fields) → 95/~48. Negative margins + the card's `overflow-hidden` crop it (bottom crop includes the +60 buffer): `-mt-[40px] -mb-[148px] xl:-mb-[92px]`.
4. **Scrollbar-gutter crop (form).** The script forces `scrolling="yes"`; on OSes with classic scrollbars a 1–2px mismatch paints a scrollbar. The iframe is rendered 30px wider than the card with `-mr-[30px]`, pushing the 17px gutter past the card's clipped edge.
5. **Layout-mode breakpoints.** The GHL **form** switches to its two-column (side-by-side fields) layout at **≥~640px** of iframe width; the **calendar** switches to its wide sidebar layout at **≥1000px**. The page layouts are sized so each widget renders its intended mode: the form column is 560px at `lg` / 680px at `xl` (two-column form on ≥1280px screens; the card is capped at 600px below `lg`), and the calendar page container is `max-w-7xl` (≈1180px of iframe on desktop).
6. **Loading overlays.** [`GhlEmbedLoader`](src/components/ui/GhlEmbedLoader.tsx) covers each card while the widget boots (brand mark + spinner + label from the page's `_data`), fading out when [`useGhlEmbedLoaded`](src/hooks/use-ghl-embed-loaded.ts) reports the widget loaded. The hook listens for the iframe's real `load` event — guarded against the initial empty-document load and the script's early `data-height` preset by checking the resource-timing buffer — with a 12s hard timeout so the overlay can never stick.

---

## Brand Logo

The brand lockup ("ExpenDesk" wordmark + gradient folder icon + "EXPENSES · SIMPLIFIED" tagline):

- **`logo.png` (repo root)** — the original source artwork (flat light-gray background). Not served.
- **`public/logo.png`** — background removed (edge flood-fill, preserving enclosed light areas), trimmed, 900×290. Used by the **Navbar** via `next/image` (`priority`, `h-9 sm:h-10 w-auto` so it scales with the pill and keeps its aspect ratio on every screen).
- **`public/logo-white.png`** — same lockup with the dark text recolored white for dark surfaces. Used by the **Footer**.

Logo paths + alt text are data-driven: `brand.logoSrc` / `brand.logoAlt` in [`navigation.json`](src/data/navigation.json) (navbar) and [`footer.json`](src/data/footer.json) (footer). The small gradient **"E" tile** still appears as the compact brand *mark* (chat header, chat launcher, embed loader) by design.

---

## Content Architecture

**Copy is never hardcoded in components.** Every user-visible string lives in a data file; components are presentation + wiring only:

- **Home-page sections** import their JSON from `src/data/sections/` and map string `iconKey`s onto Lucide/SVG icons through a local registry.
- **Route pages** keep copy in route-private `_data/` folders next to the page — `contact-us`, `contact-sales`, `pricing`, `resources/blogs`, and each `solutions/*` page. Single-section pages use one `_data/content.ts`; the multi-section **pharmaceutical** page splits data **one file per section** (`hero.ts`, `problem.ts`, …), each exporting a typed section object defined in `_data/types.ts` and re-exported from `_data/index.ts`. Headlines are split into `lead`/`accent`/`tail` runs so gradient text stays data-driven; icons are referenced by string `iconKey`.
- **Placeholder pages** (`/solutions`, `/resources`, `/resources/case-studies`, `/resources/whitepapers`) pass their eyebrow/title/message from their own `_data/content.ts` into the shared `<ComingSoon />`; the badge + CTA copy shared by all of them lives in [`src/data/coming-soon.json`](src/data/coming-soon.json).
- **Shared chrome** is data-driven too: navbar/footer from [`navigation.json`](src/data/navigation.json) / [`footer.json`](src/data/footer.json) (including the brand logo src/alt), and **all AI-chat copy** — greeting, quick questions, error message, input placeholder, aria labels — from [`chat.json`](src/data/chat.json).
- **Embed config is data**: the GHL calendar/form URLs and IDs live in the two contact pages' `_data/content.ts`, never in components.

Section CSS is not inlined either: any `@keyframes`/custom-property animation or reusable static backdrop lives in [`globals.css`](src/app/globals.css) under a section-prefixed block (e.g. `sa-`, `ck-`, `br-`, `ie-`, `cc-`, `cn-`), each animated one carrying a `prefers-reduced-motion` opt-out. Only runtime values (spin duration, gradient colors, cursor positions) are passed via `style={{}}`; purely static ambient backdrops (radial/linear gradient canvases) may also use `style={{}}` where a Tailwind utility can't express them.

**Section seams** use the shared [`ScrollBeamDivider`](src/components/ui/ScrollBeamDivider.tsx), which must sit flush on the boundary between two sections: a section that renders it keeps `pt-0` and carries its top spacing on an inner container.

To update any text, edit the corresponding `*.json` (home sections, chat, coming-soon, nav/footer) or `_data/*.ts` (route pages) — no component code needs to change. See [`src/data/README.md`](src/data/README.md) for the full home-page file-to-component map.

---

## Content Handover — Headless CMS (`content-export/`)

The [`content-export/`](content-export/) folder at the repo root is a **standalone package for the backend / CMS team** (headless WordPress + ACF on Hostinger). It mirrors every piece of editable copy on the site as **content-only JSON** — all presentation config (Tailwind classes, gradients, animation timings, layout hints) stripped out, `id`s preserved, and each frontend `iconKey` reduced to a plain semantic `icon` name.

- It is **reference/export only** — the live app does **not** read from it, so editing files there changes nothing on the site. It exists so the backend team can model ACF fields against the exact shape and values the site expects.
- [`content-export/README.md`](content-export/README.md) explains the conventions and the migration path (build ACF groups → expose via REST/WPGraphQL → frontend fetches the same shape with a local-JSON fallback, so nothing changes visually).
- [`content-export/ACF-FIELD-MAP.md`](content-export/ACF-FIELD-MAP.md) is a field-by-field build guide (ACF field types, repeaters, groups) plus the allowed `icon` value lists per section.

> **Regenerate when copy changes.** `content-export/` is a snapshot of `src/data/**` and the route `_data/**`. If site copy changes before the CMS goes live, re-export so the two stay in sync.

---

## Shared CTA — `MagneticButton`

All primary calls-to-action across the site render through one component, [`src/components/ui/MagneticButton.tsx`](src/components/ui/MagneticButton.tsx) — a cursor-following "magnetic" button driven by Framer Motion springs, with an ambient glow, shimmer sweep, and hover gradient.

```tsx
import MagneticButton from "@/components/ui/MagneticButton";

<MagneticButton variant="primary" icon={<ArrowRight size={16} />}>
  Book a Demo
</MagneticButton>

// Renders as a Next.js <Link> when given href:
<MagneticButton href="/contact-us" variant="primary">Book a Demo</MagneticButton>
```

- **Variants:** `primary` · `glow` · `secondary` · `ghost` · `outline` · `danger`. It always renders **white text on a dark/gradient fill**, so it's used for primary CTAs; light/glass secondary buttons keep their own styling.
- **Sizes:** `xs`–`2xl` presets, or override padding/radius/font-size directly through `className` (last-wins).
- **Props of note:** `href` (+ `external`), `icon` / `iconPosition`, `loading`, `fullWidth`, `magnetStrength`. Standard `onClick` and button attributes pass through.

Used by: the Hero, Problem, Solution (×2), Benefits, How It Works, FAQ, and WhyExpendesk section CTAs; the `manufacturing` and `digital-agencies` "Book a Demo" buttons; the pharmaceutical **Introducing Expendesk**, **Choose-Next-Step** (×2) and **Final-CTA** (×2) buttons; and the shared **ComingSoon** page's "Contact Us" CTA.

> **Keeping a themed gradient on `MagneticButton`.** Several pharma buttons need the page's violet/fuchsia (or white-on-purple) look, not the `primary` variant's blue→purple→pink fill (which is painted by an internal layer a `className` background can't override). The pattern: use **`variant="ghost"`** (no background layers) and supply the gradient + shape through `className`. For a light button with dark text, colour the label/icon directly since MagneticButton's own text defaults to white. The magnetic drift, shimmer, and scale still come from the component.

---

## AI Chat — docked + floating

The Expy AI chat posts visitor messages to an n8n webhook and renders the reply. It's one conversation rendered in two places, so history is never lost when it moves. **All chat copy lives in [`src/data/chat.json`](src/data/chat.json).**

- [`chat/ChatProvider.tsx`](src/components/chat/ChatProvider.tsx) — the single source of truth (messages, input, webhook call, rate-limit, per-visitor id) plus the **dock handoff**. It wraps the whole app in `layout.tsx`. On load it shows a brief "typing" animation, then reveals the greeting.
- [`chat/ChatPanel.tsx`](src/components/chat/ChatPanel.tsx) — the panel UI, rendered as `variant="docked"` or `variant="floating"`.
- [`chat/HeroChatDock.tsx`](src/components/chat/HeroChatDock.tsx) — a one-line drop-in (`<HeroChatDock />`) for a hero's right column. It renders the panel **in-flow** so it scrolls away naturally, and registers itself with the provider.
- [`layout/ChatWidget.tsx`](src/components/layout/ChatWidget.tsx) — the floating bottom-right launcher + panel.

**Behaviour:** while a hero with a dock is in view, an `IntersectionObserver` sets `heroInView`, the chat sits docked + open in the hero, and the floating widget is hidden. Once the user scrolls past, the docked chat scrolls away and the launcher springs in at the bottom-right. The dock is responsive — full-width in-flow on mobile, a fixed slot on desktop. Drop `<HeroChatDock />` into any hero's right column to reuse it (the main hero and the pharmaceutical hero both do).

---

## Blog — Headless WordPress (`/resources/blogs`)

The blog is a **headless** integration: content authors write posts in WordPress; the Next.js site fetches them as structured JSON and renders them with its own design. Nothing about the WordPress theme reaches the browser.

### How it flows

```
WordPress (Hostinger)                         Next.js site
─────────────────────                         ────────────
"Blog to JSON" plugin                         src/lib/blog-api.ts   (server data layer, ISR + cache tags)
  exposes REST API           ── fetch ──▶       │
  /wp-json/blog-to-json/v1                       ├─▶ /resources/blogs          (listing: featured + grid + pagination)
                                                 ├─▶ /resources/blogs/[slug]   (article + sidebar, SSG + on-demand)
                                                 └─▶ sitemap.xml               (one entry per post)

  on publish/update/delete   ── POST ──▶       POST /api/revalidate  (purges the tagged cache instantly)
  (webhook plugin)                             src/app/api/revalidate/route.ts
```

- **Data layer — [`src/lib/blog-api.ts`](src/lib/blog-api.ts).** All fetches are server-side, cached with Next.js ISR (`revalidate: 300s` fallback) and **tagged** (`blog-list`, `blog-post-<slug>`) so they can be purged on demand. It decodes WordPress HTML entities, hides bare-email author names behind a brand byline, and **degrades gracefully** — any CMS hiccup is logged and returns `null` rather than crashing the page. Helpers: `getBlogPosts`, `getBlogPostBySlug`, `getAllBlogSlugs`, `estimateReadingTime`, `formatBlogDate`.
- **Types — [`src/types/blog.ts`](src/types/blog.ts).** Mirrors the plugin's schema. A post's body is a **`ContentBlock[]`** discriminated union (`heading`, `paragraph`, `quote`, `list`, `image`, `code`, `table`, `embed`, `separator`, `unknown`) with inline `TextRun`s for formatting.
- **Renderer — [`BlogContent.tsx`](src/app/resources/blogs/_components/BlogContent.tsx).** Maps each block to **semantic React elements** — no `dangerouslySetInnerHTML` for post body. An `unknown` block is rendered as plain text so **content is never dropped and never injected as raw HTML**.
- **Listing — [`page.tsx`](src/app/resources/blogs/page.tsx).** Gradient hero → featured (newest) post on page 1 → responsive card grid → pagination. `?category=` filters the cached list in-process (the plugin has no category endpoint; volumes are small). Handles distinct **error** and **empty** states.
- **Post — [`[slug]/page.tsx`](src/app/resources/blogs/[slug]/page.tsx).** `generateStaticParams` pre-renders every existing post at build; `dynamicParams = true` renders posts published afterwards on first request. Emits per-post OpenGraph/Twitter metadata, a canonical URL, and **`BlogPosting` JSON-LD**. Sticky sidebar ([`BlogSidebar`](src/app/resources/blogs/_components/BlogSidebar.tsx)): brand CTA + recent posts + category counts.
- **Copy** lives in [`_data/content.ts`](src/app/resources/blogs/_data/content.ts) (per the project's no-inline-copy convention). **Blog typography** is scoped under `.blog-content` in [`globals.css`](src/app/globals.css) so it never leaks into the rest of the site.

### Security (untrusted CMS input)

Post HTML is treated as untrusted. `BlogContent` enforces: an inline-style **denylist** (`position`, `z-index`, `top/left/…`, `expression`, `url(...)`); an iframe-embed **allowlist** (YouTube, Vimeo, Spotify, SoundCloud, CodePen, CodeSandbox, Google Maps) with a sandboxed `<iframe>`; and safe links (`javascript:`/`data:`/`vbscript:` dropped, external links get `rel="noopener noreferrer"`).

### Instant updates (revalidation webhook)

[`src/app/api/revalidate/route.ts`](src/app/api/revalidate/route.ts) accepts a secret-guarded `POST` and calls `revalidateTag(..., 'max')` (Next 16 two-arg, stale-while-revalidate form) to purge the list and, if a `slug` is given, that post. The WordPress side is [`wordpress/blog-to-json-webhook.php`](wordpress/blog-to-json-webhook.php) — a small plugin that pings this endpoint on every publish/update/trash/delete of a `post`. Without the webhook the site still refreshes within the 5-minute ISR window; with it, changes appear within seconds.

> **Install the webhook plugin:** edit the two constants at the top of `blog-to-json-webhook.php` (`BTJ_NEXTJS_ORIGIN` = the deployed site origin, `BTJ_REVALIDATE_SECRET` = the same value as `REVALIDATE_SECRET` in the Next.js env), upload it to `wp-content/plugins/` (or `mu-plugins/` to keep it always-on), and activate it.

### Go-live checklist

1. Set `NEXT_PUBLIC_SITE_URL` to the real production domain (drives canonicals, `sitemap.xml`, `robots.txt`, OG image URLs).
2. Set `WORDPRESS_API_URL` to the site's `…/wp-json/blog-to-json/v1` base, and keep `REVALIDATE_SECRET` in the host env.
3. Install + activate `wordpress/blog-to-json-webhook.php` on the WP site with the **same** secret and the deployed origin.
4. Verify: publish a test post in WordPress → it appears at `/resources/blogs` within seconds and gets a `/resources/blogs/<slug>` page + a sitemap entry.

---

## Rendering & Performance

The home page is split for fast first paint:

- **Statically imported** (`HeroSection`, `LeadMagnetSection`, `TestimonialsSection`, `WhyExpendesk`) so they are in the initial bundle / first paint.
- **Lazy-loaded** with `next/dynamic` (`ssr: true`) so their client JS is code-split into separate chunks while still server-rendering for SEO: `ProblemSection`, `SolutionSection`, `BenefitsSection`, `FeaturesVideo`, `HowItWorksSection`, `ComparisonSection`, `FaqSection`.

Other measures:

- The only web font is Poppins, self-hosted by `next/font/google` with `display: "swap"` (no runtime request to Google, no layout shift). Six weights are loaded — 400/500/600/700/800/900 — matching exactly the `font-*` utilities the codebase uses, so nothing is faux-bolded and no unused cut is shipped.
- `next.config.ts` enables `compress`, `optimizeCss`, AVIF/WebP image formats, and strips the `x-powered-by` header.
- The navbar logo is served through `next/image` with `priority`; the footer logo lazy-loads.
- **Blog images are optimised through `next/image`.** `next.config.ts` allowlists the WordPress host under `images.remotePatterns` (scoped to `/wp-content/uploads/**`). The host is derived from `WORDPRESS_API_URL` at build with a hardcoded fallback, so **changing the CMS domain is a single env edit** — no code change. A WordPress image on a non-allowlisted host will throw at render, so update the env if the CMS moves.
- `prefers-reduced-motion` is honoured across the heavier animations (LeadMagnet, Testimonials, WhyExpendesk, the global scroll engine, and the GSAP/ScrollTrigger pharmaceutical sequences).
- Marquees/carousels use `will-change: transform` and pause on hover/touch.

> **Typography note:** the whole site renders in Poppins. It is loaded once in [`layout.tsx`](src/app/layout.tsx) and exposed as `--font-poppins`, which [`globals.css`](src/app/globals.css) maps onto Tailwind's `--font-sans`. Because Tailwind's preflight derives the document font from that variable, every element inherits Poppins — do **not** set `font-family` (or a `font-['…']` arbitrary utility) in components.

---

## SEO & Metadata

- **Global defaults** — [`layout.tsx`](src/app/layout.tsx) sets `metadataBase` (from `SITE_URL`), a title **template** (`%s — Expendesk`), description, keywords, and default OpenGraph. Every page inherits these; a page's own `metadata`/`generateMetadata` overrides only what it declares.
- **Per-page** — the solution/contact/pricing pages and blog listing export a static `metadata`; blog posts build theirs in `generateMetadata` (title, excerpt, canonical, article OpenGraph/Twitter, author, tags, image).
- **Structured data** — blog posts emit `BlogPosting` **JSON-LD**; the FAQ section emits `FAQPage` JSON-LD.
- **[`robots.ts`](src/app/robots.ts)** — allows everything except `/api/`, and points crawlers at the sitemap.
- **[`sitemap.ts`](src/app/sitemap.ts)** — emits the static marketing routes plus one entry per published blog post; degrades to just the static routes if the API is unreachable.

All absolute URLs (canonicals, OG images, sitemap) derive from `SITE_URL` ([`lib/site.ts`](src/lib/site.ts)) — **set `NEXT_PUBLIC_SITE_URL` in production** or these point at `localhost`.

---

## Smooth Scrolling

In-page hash navigation is owned entirely by [`ScrollToHash.tsx`](src/components/layout/ScrollToHash.tsx) + [`lib/scroll.ts`](src/lib/scroll.ts). Because below-fold sections lazy-load, their final scroll position keeps moving as content streams in; the custom engine re-resolves the target every animation frame, snaps on arrival, runs a short post-settle correction, and yields immediately to manual input. Native CSS `scroll-behavior` is deliberately left `auto` so it doesn't fight the engine.

`ScrollToHash` intercepts same-page hash clicks in capture phase with `stopPropagation()`, so the link's own React `onClick` never fires. To let UI react to that navigation, it dispatches a `window` event (`IN_PAGE_NAV_EVENT`, exported from `ScrollToHash.tsx`) — the Navbar listens for it to auto-close the mobile menu after a section link is tapped.

---

## Environment Variables

Create `.env.local`:

```bash
# Endpoint the ChatWidget POSTs visitor messages to (e.g. an n8n workflow)
NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL=https://your-n8n-instance/webhook/expendesk-chat

# Headless-WordPress blog (Blog-to-JSON plugin) REST base — no trailing slash
WORDPRESS_API_URL=https://your-wp-site/wp-json/blog-to-json/v1

# Shared secret for POST /api/revalidate — must match BTJ_REVALIDATE_SECRET
# in wordpress/blog-to-json-webhook.php
REVALIDATE_SECRET=your-long-random-secret

# Canonical site origin for metadata, sitemap.xml, robots.txt, OG image URLs.
# Set to the real production domain on deploy.
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable | Used by | If missing |
|---|---|---|
| `NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL` | Chat widget | Chat renders, but sending a message fails with the error state. |
| `WORDPRESS_API_URL` | Blog data layer | Falls back to a hardcoded default base; point it at your WP site. |
| `REVALIDATE_SECRET` | `/api/revalidate` webhook | Endpoint returns 500 and rejects revalidation; blog still refreshes on the 5-min ISR window. |
| `NEXT_PUBLIC_SITE_URL` | Metadata, sitemap, robots | Falls back to `http://localhost:3000` — wrong canonicals/sitemap in production. |

> The GHL calendar/form embeds need **no environment variables** — their widget URLs/IDs are content, kept in the contact pages' `_data/content.ts`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build & run production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Styling Rules

- **`src/app/globals.css`** is the only place for global CSS class definitions and `@keyframes`. Each block has a header naming the component that uses it.
- **`style={{}}`** props inside components are reserved for runtime-computed values (colors from JS objects, dynamic widths, cursor-relative positions) and static ambient gradient canvases that Tailwind utilities can't express.
- **Tailwind utility classes** are applied directly in `className`.
- No `<style>` blocks inside component files.

---

## Deployment

**Production:** https://expendesk-v1.vercel.app/

Hosted on [Vercel](https://vercel.com). Connect the GitHub repository to a Vercel project for automatic preview and production deployments on push, and set `NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL` (plus the blog variables above) in the project's environment variables. Build settings are pinned in [`vercel.json`](vercel.json).
