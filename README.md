# Expendesk — Landing Page

**Live site:** https://expendesk-v1.vercel.app/

Marketing landing page for **Expendesk**, an expense intelligence platform built for finance teams and SMEs. A single long-form home page composed of independent, animated sections, a set of per-industry solution pages, an AI chat widget, and a **headless-WordPress blog** at `/resources/blogs`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 (most of the site) + GSAP 3 / ScrollTrigger (pharmaceutical scroll sequences) + hand-written CSS keyframes |
| Icons | Lucide React |
| Fonts | System sans-serif stack (body) · Syne self-hosted via `next/font` (Hero headings) |
| Content | Headless WordPress ("Blog to JSON" plugin) for `/resources/blogs`; all marketing copy in local JSON/TS data files |
| Runtime | React 19 |

Only the libraries actually imported by the app are kept as dependencies: `next`, `react`, `react-dom`, `framer-motion` (24 files), `lucide-react` (23 files), `gsap` (7 pharmaceutical section components, via `ScrollTrigger`), plus `clsx` + `tailwind-merge` behind the `cn()` helper that ships for shadcn-style components. No UI-kit or particle packages are pulled in.

---

## Project Structure

```
src/
├── app/
│   ├── globals.css                 # Single source of truth for global CSS + @keyframes (incl. .blog-content typography)
│   ├── layout.tsx                  # Root layout: global metadata (metadataBase, title template); ChatProvider wraps Navbar + ScrollToHash + Footer + ChatWidget
│   ├── page.tsx                    # Home page composition (above-fold static, below-fold lazy)
│   ├── robots.ts                   # robots.txt (allow all, disallow /api/) + sitemap pointer
│   ├── sitemap.ts                  # sitemap.xml: static routes + every published blog post (from the WP API)
│   ├── api/
│   │   └── revalidate/route.ts     # POST webhook: WordPress → on-demand ISR purge (secret-guarded)
│   ├── solutions/                  # Per-industry SEO landing pages (copy in each page's _data/)
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
│   │       │   ├── hero.ts                   # Hero: headline, benefits, CTAs, trust tags, scroll label
│   │       │   ├── problem.ts                # Problem: every headline/label/CTA + stats, chips, tools, cards
│   │       │   ├── self-assessment.ts        # Self-assessment: copy + audit questions + score-tier config
│   │       │   ├── checklist-intro.ts        # Checklist intro: copy + audience roles + document-mock preview
│   │       │   ├── bridge.ts                 # Bridge: copy + "same challenges" cards
│   │       │   ├── introducing-expendesk.ts  # Introducing: copy + capability cards + CTA
│   │       │   ├── checklist-contents.ts     # Checklist contents: copy + revealed categories + locked count
│   │       │   ├── choose-next-step.ts       # Choose next step: copy + CTA options + trust points
│   │       │   └── final-cta.ts              # Final CTA: copy + two action panels
│   │       └── page.tsx            # Composes the sections in order
│   └── resources/                  # Resources dropdown routes
│       ├── blogs/                  # Headless-WordPress blog (see "Blog" section below)
│       │   ├── layout.tsx          # Light-theme white canvas wrapper for all blog routes
│       │   ├── loading.tsx         # Skeleton for the listing (hero + featured + grid)
│       │   ├── page.tsx            # Listing: hero → featured post → card grid → pagination (+ ?category filter)
│       │   ├── [slug]/             # Individual post — SSG at build + on-demand for new posts
│       │   │   ├── page.tsx        # Article + sticky sidebar, OpenGraph/Twitter meta, JSON-LD
│       │   │   └── not-found.tsx   # Per-post 404
│       │   ├── _components/        # BlogCard · FeaturedPost · BlogContent · BlogSidebar · BlogPagination · ShareLinks
│       │   └── _data/content.ts    # All blog UI copy (labels, CTA, empty/error states)
│       └── case-studies/ · faqs/ · whitepapers/   # Still placeholders → notFound()
│
├── components/
│   ├── chat/                       # Expendesk AI chat — shared state, two render targets
│   │   ├── ChatProvider.tsx        # Context: conversation state, webhook, dock handoff
│   │   ├── ChatPanel.tsx           # Shared panel UI (docked + floating variants)
│   │   └── HeroChatDock.tsx        # One-line drop-in slot for a hero's right column
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky pill nav, animated dropdowns, scroll progress bar
│   │   ├── ChatWidget.tsx          # Floating launcher + panel (hidden while a hero dock is in view)
│   │   └── ScrollToHash.tsx        # Single owner of in-page hash smooth-scrolling
│   ├── sections/
│   │   ├── HeroSection.tsx         # Canvas dot grid, animated counters; docks the AI chat on the right
│   │   ├── ProblemSection.tsx      # SVG cause→chaos→effect connector diagram
│   │   ├── SolutionSection.tsx     # Node/beam diagram, feature carousel, dashboard preview
│   │   ├── BenefitsSection.tsx     # Bento grid (desktop) / swipeable carousel (mobile)
│   │   ├── FeaturesVideo.tsx       # 3D tilt card + interactive industry selector
│   │   ├── LeadMagnetSection.tsx   # 3D eBook cover, download CTA
│   │   ├── TestimonialsSection.tsx # Dual infinite marquee rows
│   │   └── WhyExpendesk.tsx        # Before/after comparison (table on desktop, cards on mobile)
│   └── ui/
│       ├── MagneticButton.tsx      # Shared magnetic CTA (cursor-follow, gradient variants)
│       └── ScrollBeamDivider.tsx   # Shared animated section divider
│
├── data/
│   ├── navigation.json             # Navbar links, dropdown items, Login + CTA
│   └── sections/                   # One JSON file per home section (all copy lives here)
│       └── hero · problem · solution · benefits · features · lead-magnet · testimonials · why-expendesk .json
│
├── lib/
│   ├── blog-api.ts                 # Server data layer for the WP Blog-to-JSON API (ISR, cache tags, helpers)
│   ├── site.ts                     # SITE_URL — canonical origin for metadata/sitemap/canonicals
│   ├── scroll.ts                   # Layout-shift-aware smooth-scroll engine for hash links
│   └── utils.ts                    # cn() helper (shadcn convention; currently unused)
│
└── types/
    ├── blog.ts                     # Blog-to-JSON API schema (ContentBlock union, BlogPost, list response)
    └── index.ts                    # Shared TypeScript interfaces (Testimonial, Chat*, Why*)

wordpress/
└── blog-to-json-webhook.php        # WP plugin: pings /api/revalidate on publish/update/delete (install on the WP site)
```

---

## Content Architecture

**Copy is never hardcoded in components.** Home-page sections each import their own JSON from `src/data/sections/` and map string `iconKey`s onto Lucide/SVG icons through a local registry. The per-industry `solutions/*` pages keep their copy in route-private `_data/` folders next to the page:

- **`manufacturing/`** and **`digital-agencies/`** are single-section pages, so their copy lives in one `_data/content.ts`.
- **`pharmaceutical/`** is a multi-section page built out over time, so its data is **split one file per section** under `_data/` — `hero.ts`, `problem.ts`, `self-assessment.ts`, `checklist-intro.ts`, `bridge.ts`, `introducing-expendesk.ts`, … — each exporting a single typed section object (`HeroContent`, `ProblemContent`, `SelfAssessmentContent`, `ChecklistIntroContent`, `BridgeContent`, `IntroducingExpendeskContent`, …) defined in `_data/types.ts` and re-exported from `_data/index.ts`. **Every** string a section renders — headlines (split into `lead`/`accent`/`tail` runs so gradient text stays data-driven), badges, paragraphs, labels, CTAs, chips, cards, stats, audit questions, score-tier config, audience roles, capability lists, and even the download/CTA URLs — lives in its section file. Components are purely presentational (`import { problem } from "../_data"` → map over `problem.oldTools`, read `problem.headline.accent`); there is **no inline copy in the components** and **no single catch-all data file**.
  - Where data needs to point at an icon, it stores a string `iconKey` (e.g. the self-assessment score tiers, the checklist audience chips, the bridge challenge cards, the Expendesk capability cards) and the component maps it onto an SVG/Lucide icon through a local registry — the same pattern the home sections use, so no JSX leaks into the data files.
  - Section CSS is **not** inlined either: any `@keyframes`/custom-property animation, injected `<style>` block, or reusable static backdrop (e.g. the self-assessment card's spinning border beam under `sa-`, the checklist card's travelling stroke beam under `ck-`, the bridge mobile marquee under `br-`, the Expendesk carousel's scrollbar-hide under `ie-`, the checklist-contents masked dot grid under `cc-`, the choose-next-step dot grids + shimmer-text sizing under `cn-`) lives in [`globals.css`](src/app/globals.css) under a section-prefixed block; animated ones each carry a `prefers-reduced-motion` opt-out. Only runtime values (spin duration, gradient colors) are passed via `style={{}}`.
  - **Section seams** use the shared [`ScrollBeamDivider`](src/components/ui/ScrollBeamDivider.tsx), which must sit flush on the boundary between two sections. A section that renders it keeps **`pt-0`** and carries its top spacing on an inner container instead — otherwise the section's top padding pushes the divider down into its body. Keeping the previous section's bottom padding equal to this section's inner top padding centers the beam on the seam.
  - Add a new section by dropping a `<section>.ts` file into `_data/`, adding its interface to `types.ts`, re-exporting from `index.ts`, and putting any custom CSS in `globals.css`.

To update any text, edit the corresponding `*.json` (home sections), `_data/content.ts` (single-section solution pages), or `_data/<section>.ts` (pharmaceutical) — no component code needs to change. See [`src/data/README.md`](src/data/README.md) for the full home-page file-to-component map.

---

## Content Handover — Headless CMS (`content-export/`)

The [`content-export/`](content-export/) folder at the repo root is a **standalone package for the backend / CMS team** (headless WordPress + ACF on Hostinger). It mirrors every piece of editable copy on the site as **content-only JSON** — all presentation config (Tailwind classes, gradients, animation timings, layout hints) stripped out, `id`s preserved, and each frontend `iconKey` reduced to a plain semantic `icon` name.

- It is **reference/export only** — the live app does **not** read from it, so editing files there changes nothing on the site. It exists so the backend team can model ACF fields against the exact shape and values the site expects.
- [`content-export/README.md`](content-export/README.md) explains the conventions and the migration path (build ACF groups → expose via REST/WPGraphQL → frontend fetches the same shape with a local-JSON fallback, so nothing changes visually).
- [`content-export/ACF-FIELD-MAP.md`](content-export/ACF-FIELD-MAP.md) is a field-by-field build guide (ACF field types, repeaters, groups) plus the allowed `icon` value lists per section.

> **Regenerate when copy changes.** `content-export/` is a snapshot of `src/data/**` and the solutions `_data/**`. If site copy changes before the CMS goes live, re-export so the two stay in sync.

---

## Shared CTA — `MagneticButton`

All primary calls-to-action across the site render through one component, [`src/components/ui/MagneticButton.tsx`](src/components/ui/MagneticButton.tsx) — a cursor-following "magnetic" button driven by Framer Motion springs, with an ambient glow, shimmer sweep, and hover gradient.

```tsx
import MagneticButton from "@/components/ui/MagneticButton";

<MagneticButton variant="primary" icon={<ArrowRight size={16} />}>
  Book a Demo
</MagneticButton>

// Renders as a Next.js <Link> when given href:
<MagneticButton href="/#demo" variant="primary">Book a Demo</MagneticButton>
```

- **Variants:** `primary` · `glow` · `secondary` · `ghost` · `outline` · `danger`. It always renders **white text on a dark/gradient fill**, so it's used for primary CTAs; light/glass secondary buttons keep their own styling.
- **Sizes:** `xs`–`2xl` presets, or override padding/radius/font-size directly through `className` (last-wins).
- **Props of note:** `href` (+ `external`), `icon` / `iconPosition`, `loading`, `fullWidth`, `magnetStrength`. Standard `onClick` and button attributes pass through.

Used by: the Hero, Problem, Solution (×2), Benefits, and WhyExpendesk section CTAs; the `manufacturing` and `digital-agencies` "Book a Demo" buttons; the pharmaceutical **Introducing Expendesk "Book a Free Demo"** CTA; and the two **Choose-Next-Step** card buttons ("Download Checklist" / "Schedule Demo"); and the two **Final-CTA** action-panel buttons ("Download Checklist" / "Book a Demo").

> **Keeping a themed gradient on `MagneticButton`.** Several pharma buttons need the page's violet/fuchsia (or white-on-purple) look, not the `primary` variant's blue→purple→pink fill (which is painted by an internal layer a `className` background can't override). The pattern: use **`variant="ghost"`** (no background layers) and supply the gradient + shape through `className` — e.g. `<MagneticButton variant="ghost" className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 …">`. For a light button with dark text (the Choose-Next-Step primary card), colour the label/icon directly (`<span className="text-purple-700">…</span>`, `icon={<ArrowRight className="text-purple-700" />}`) since MagneticButton's own text defaults to white. The magnetic drift, shimmer, and scale still come from the component.
>
> The remaining pharma CTAs (Hero download buttons, Checklist "Download", Self-Assessment "Schedule") are still bespoke — their light/outline styling has no matching `MagneticButton` variant — and can be migrated the same way if desired.

---

## AI Chat — docked + floating

The Expendesk AI chat posts visitor messages to an n8n webhook and renders the reply. It's one conversation rendered in two places, so history is never lost when it moves:

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

- **Above the fold** (`HeroSection`, `WhyExpendesk`, `TestimonialsSection`, `LeadMagnetSection`) is imported statically.
- **Below the fold** (`ProblemSection`, `SolutionSection`, `BenefitsSection`, `FeaturesVideo`) is loaded with `next/dynamic` (`ssr: true`) so its client JS is code-split into separate chunks while still server-rendering for SEO.

Other measures:

- The only web font is Syne, self-hosted by `next/font/google` with `display: "swap"` and scoped to the Hero headings (no runtime request to Google). Body copy uses the native system sans-serif stack, so there is no blocking font fetch for the bulk of the page.
- `next.config.ts` enables `compress`, `optimizeCss`, AVIF/WebP image formats, and strips the `x-powered-by` header.
- **Blog images are optimised through `next/image`.** `next.config.ts` allowlists the WordPress host under `images.remotePatterns` (scoped to `/wp-content/uploads/**`). The host is derived from `WORDPRESS_API_URL` at build with a hardcoded fallback, so **changing the CMS domain is a single env edit** — no code change. A WordPress image on a non-allowlisted host will throw at render, so update the env if the CMS moves.
- `prefers-reduced-motion` is honoured across the heavier animations (LeadMagnet, Testimonials, WhyExpendesk, the global scroll engine, and the GSAP/ScrollTrigger pharmaceutical sequences).
- Marquees/carousels use `will-change: transform` and pause on hover/touch.

> **Typography note:** body text renders in the native system sans-serif stack by design. The Hero applies Syne directly via `syne.className`. (Previously Geist/Geist Mono were loaded and exposed as `--font-*` CSS variables on `<body>` but never mapped to a `font-family`, so they had no visual effect — they have been removed to drop the unused font fetches without changing how anything looks. To adopt Geist for body copy later, load it via `next/font` and map it in an `@theme inline` block in `globals.css`.)

---

## SEO & Metadata

- **Global defaults** — [`layout.tsx`](src/app/layout.tsx) sets `metadataBase` (from `SITE_URL`), a title **template** (`%s — Expendesk`), description, keywords, and default OpenGraph. Every page inherits these; a page's own `metadata`/`generateMetadata` overrides only what it declares.
- **Per-page** — the solution pages and blog listing export a static `metadata`; blog posts build theirs in `generateMetadata` (title, excerpt, canonical, article OpenGraph/Twitter, author, tags, image).
- **Structured data** — blog posts emit `BlogPosting` **JSON-LD** built only from serialized API fields (with `<` escaped), safe to inline.
- **[`robots.ts`](src/app/robots.ts)** — allows everything except `/api/`, and points crawlers at the sitemap.
- **[`sitemap.ts`](src/app/sitemap.ts)** — emits the static marketing routes plus one entry per published blog post (walked from the WP API, so new posts appear automatically); degrades to just the static routes if the API is unreachable.

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
- **`style={{}}`** props inside components are reserved for runtime-computed values (colors from JS objects, dynamic widths, cursor-relative positions).
- **Tailwind utility classes** are applied directly in `className`.
- No `<style>` blocks inside component files.

---

## Deployment

**Production:** https://expendesk-v1.vercel.app/

Hosted on [Vercel](https://vercel.com). Connect the GitHub repository to a Vercel project for automatic preview and production deployments on push, and set `NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL` in the project's environment variables. Build settings are pinned in [`vercel.json`](vercel.json).
