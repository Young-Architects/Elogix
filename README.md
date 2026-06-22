# Expendesk — Landing Page

**Live site:** https://expendesk-v1.vercel.app/

Marketing landing page for **Expendesk**, an expense intelligence platform built for finance teams and SMEs. A single long-form home page composed of independent, animated sections, plus a small set of per-industry solution pages and an AI chat widget.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 + hand-written CSS keyframes |
| Icons | Lucide React |
| Fonts | System sans-serif stack (body) · Syne self-hosted via `next/font` (Hero headings) |
| Runtime | React 19 |

Only the libraries actually imported by the app are kept as dependencies (`next`, `react`, `react-dom`, `framer-motion`, `lucide-react`, plus `clsx` + `tailwind-merge` backing the `cn()` helper). No UI-kit, particle, or animation-runtime packages are pulled in.

---

## Project Structure

```
src/
├── app/
│   ├── globals.css                 # Single source of truth for global CSS + @keyframes
│   ├── layout.tsx                  # Root layout: fonts, metadata, viewport, Navbar, ChatWidget
│   ├── page.tsx                    # Home page composition (above-fold static, below-fold lazy)
│   └── solutions/                  # Per-industry SEO landing pages
│       ├── digital-agencies/page.tsx
│       ├── manufacturing/page.tsx
│       └── pharmaceutical/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky pill nav, animated dropdowns, scroll progress bar
│   │   ├── ChatWidget.tsx          # Floating AI chat (posts to an n8n webhook)
│   │   └── ScrollToHash.tsx        # Single owner of in-page hash smooth-scrolling
│   ├── sections/
│   │   ├── HeroSection.tsx         # Canvas dot grid, animated counters, live ticker
│   │   ├── ProblemSection.tsx      # SVG cause→chaos→effect connector diagram
│   │   ├── SolutionSection.tsx     # Node/beam diagram, feature carousel, dashboard preview
│   │   ├── BenefitsSection.tsx     # Bento grid (desktop) / swipeable carousel (mobile)
│   │   ├── FeaturesVideo.tsx       # 3D tilt card + interactive industry selector
│   │   ├── LeadMagnetSection.tsx   # 3D eBook cover, download CTA
│   │   ├── TestimonialsSection.tsx # Dual infinite marquee rows
│   │   └── WhyExpendesk.tsx        # Before/after comparison (table on desktop, cards on mobile)
│   └── ui/
│       └── ScrollBeamDivider.tsx   # Shared animated section divider
│
├── data/
│   ├── navigation.json             # Navbar links, dropdown items, CTA
│   └── sections/                   # One JSON file per section (all copy lives here)
│       ├── hero.json
│       ├── problem.json
│       ├── solution.json
│       ├── benefits.json
│       ├── features.json
│       ├── lead-magnet.json
│       ├── testimonials.json
│       └── why-expendesk.json
│
├── lib/
│   ├── scroll.ts                   # Layout-shift-aware smooth-scroll engine for hash links
│   └── utils.ts                    # cn() — clsx + tailwind-merge class combiner
│
└── types/
    └── index.ts                    # Shared TypeScript interfaces (Testimonial, Chat*, Why*)
```

---

## Content Architecture

**All copy lives in `src/data/`** — headings, labels, descriptions, badge text, stats, testimonials. Each section component imports its own JSON file and maps string `iconKey`s onto Lucide/SVG icons through a local registry; nothing user-facing is hardcoded in components.

To update any text, edit the corresponding JSON file — no component code needs to change. See [`src/data/README.md`](src/data/README.md) for the full file-to-component map.

---

## Rendering & Performance

The home page is split for fast first paint:

- **Above the fold** (`HeroSection`, `WhyExpendesk`, `TestimonialsSection`, `LeadMagnetSection`) is imported statically.
- **Below the fold** (`ProblemSection`, `SolutionSection`, `BenefitsSection`, `FeaturesVideo`) is loaded with `next/dynamic` (`ssr: true`) so its client JS is code-split into separate chunks while still server-rendering for SEO.

Other measures:

- The only web font is Syne, self-hosted by `next/font/google` with `display: "swap"` and scoped to the Hero headings (no runtime request to Google). Body copy uses the native system sans-serif stack, so there is no blocking font fetch for the bulk of the page.
- `next.config.ts` enables `compress`, `optimizeCss`, AVIF/WebP image formats, and strips the `x-powered-by` header.
- `prefers-reduced-motion` is honoured across the heavier animations (LeadMagnet, Testimonials, WhyExpendesk, the global scroll engine).
- Marquees/carousels use `will-change: transform` and pause on hover/touch.

> **Typography note:** body text renders in the native system sans-serif stack by design. The Hero applies Syne directly via `syne.className`. (Previously Geist/Geist Mono were loaded and exposed as `--font-*` CSS variables on `<body>` but never mapped to a `font-family`, so they had no visual effect — they have been removed to drop the unused font fetches without changing how anything looks. To adopt Geist for body copy later, load it via `next/font` and map it in an `@theme inline` block in `globals.css`.)

---

## Smooth Scrolling

In-page hash navigation is owned entirely by [`ScrollToHash.tsx`](src/components/layout/ScrollToHash.tsx) + [`lib/scroll.ts`](src/lib/scroll.ts). Because below-fold sections lazy-load, their final scroll position keeps moving as content streams in; the custom engine re-resolves the target every animation frame, snaps on arrival, runs a short post-settle correction, and yields immediately to manual input. Native CSS `scroll-behavior` is deliberately left `auto` so it doesn't fight the engine.

---

## Environment Variables

The chat widget posts to an external webhook. Create `.env.local`:

```bash
# Endpoint the ChatWidget POSTs visitor messages to (e.g. an n8n workflow)
NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL=https://your-n8n-instance/webhook/expendesk-chat
```

Without it the chat UI still renders, but sending a message will fail and show the error state.

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
