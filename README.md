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

Only the libraries actually imported by the app are kept as dependencies (`next`, `react`, `react-dom`, `framer-motion`, `lucide-react`, plus `clsx` + `tailwind-merge` behind the `cn()` helper that ships for shadcn-style components). No UI-kit, particle, or animation-runtime packages are pulled in.

---

## Project Structure

```
src/
├── app/
│   ├── globals.css                 # Single source of truth for global CSS + @keyframes
│   ├── layout.tsx                  # Root layout: wraps app in ChatProvider; Navbar, ScrollToHash, ChatWidget
│   ├── page.tsx                    # Home page composition (above-fold static, below-fold lazy)
│   ├── solutions/                  # Per-industry SEO landing pages (copy in each page's _data/)
│   │   ├── digital-agencies/
│   │   │   ├── _data/content.ts    # Page copy
│   │   │   └── page.tsx
│   │   ├── manufacturing/
│   │   │   ├── _data/content.ts    # Page copy
│   │   │   └── page.tsx
│   │   └── pharmaceutical/         # Built section-by-section (route-private _ folders)
│   │       ├── _components/        # HeroSection.tsx (+ future sections)
│   │       ├── _data/content.ts    # All page copy
│   │       └── page.tsx            # Composes the sections in order
│   └── resources/                  # Resources dropdown routes (placeholders → notFound())
│       ├── blogs/page.tsx · case-studies/page.tsx · faqs/page.tsx · whitepapers/page.tsx
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
│   ├── scroll.ts                   # Layout-shift-aware smooth-scroll engine for hash links
│   └── utils.ts                    # cn() helper (shadcn convention; currently unused)
│
└── types/
    └── index.ts                    # Shared TypeScript interfaces (Testimonial, Chat*, Why*)
```

---

## Content Architecture

**Copy is never hardcoded in components.** Home-page sections each import their own JSON from `src/data/sections/` and map string `iconKey`s onto Lucide/SVG icons through a local registry. The per-industry `solutions/*` pages keep their copy in a route-private `_data/content.ts` next to the page.

To update any text, edit the corresponding `*.json` (home sections) or `_data/content.ts` (solution pages) — no component code needs to change. See [`src/data/README.md`](src/data/README.md) for the full file-to-component map.

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

Used by: the Hero, Problem, Solution (×2), Benefits, and WhyExpendesk section CTAs, plus the three `solutions/*` "Book a Demo" buttons.

---

## AI Chat — docked + floating

The Expendesk AI chat posts visitor messages to an n8n webhook and renders the reply. It's one conversation rendered in two places, so history is never lost when it moves:

- [`chat/ChatProvider.tsx`](src/components/chat/ChatProvider.tsx) — the single source of truth (messages, input, webhook call, rate-limit, per-visitor id) plus the **dock handoff**. It wraps the whole app in `layout.tsx`. On load it shows a brief "typing" animation, then reveals the greeting.
- [`chat/ChatPanel.tsx`](src/components/chat/ChatPanel.tsx) — the panel UI, rendered as `variant="docked"` or `variant="floating"`.
- [`chat/HeroChatDock.tsx`](src/components/chat/HeroChatDock.tsx) — a one-line drop-in (`<HeroChatDock />`) for a hero's right column. It renders the panel **in-flow** so it scrolls away naturally, and registers itself with the provider.
- [`layout/ChatWidget.tsx`](src/components/layout/ChatWidget.tsx) — the floating bottom-right launcher + panel.

**Behaviour:** while a hero with a dock is in view, an `IntersectionObserver` sets `heroInView`, the chat sits docked + open in the hero, and the floating widget is hidden. Once the user scrolls past, the docked chat scrolls away and the launcher springs in at the bottom-right. The dock is responsive — full-width in-flow on mobile, a fixed slot on desktop. Drop `<HeroChatDock />` into any hero's right column to reuse it (the main hero and the pharmaceutical hero both do).

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

`ScrollToHash` intercepts same-page hash clicks in capture phase with `stopPropagation()`, so the link's own React `onClick` never fires. To let UI react to that navigation, it dispatches a `window` event (`IN_PAGE_NAV_EVENT`, exported from `ScrollToHash.tsx`) — the Navbar listens for it to auto-close the mobile menu after a section link is tapped.

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
