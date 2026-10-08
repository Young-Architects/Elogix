# Architecture Snapshot

## Repository Map

64 modules, 643 symbols, grouped by area. Every module is in `facts.jsonl`, or query_facts(kind="module").

| Area | Modules | Symbols | Languages |
|------|---------|---------|-----------|
| `src` | 61 | 624 | typescript |
| `scripts` | 1 | 9 | typescript |
| `.` | 1 | 5 | typescript |
| `wordpress` | 1 | 5 | php |

Largest modules:
- `src/components/sections` — 115 symbols (typescript)
- `src/app/solutions/pharmaceutical/_components` — 87 symbols (typescript)
- `src/lib` — 61 symbols (typescript)
- `src/app/solutions/pharmaceutical/_data` — 43 symbols (typescript)
- `src/components/layout` — 31 symbols (typescript)
- `src/app/resources/blogs/_components` — 26 symbols (typescript)
- `src/types` — 26 symbols (typescript)
- `src/app` — 22 symbols (typescript)
- `src/components/ui` — 21 symbols (typescript)
- `src/app/pricing/_components` — 15 symbols (typescript)
- `src/components/chat` — 14 symbols (typescript)
- `src/app/legal/_data` — 12 symbols (typescript)
- `scripts` — 9 symbols (typescript)
- `src/app/solutions/pharmaceutical` — 8 symbols (typescript)
- `src/hooks` — 8 symbols (typescript)
- `src/app/book-a-demo/_data` — 7 symbols (typescript)
- `src/app/contact-us/_data` — 7 symbols (typescript)
- `src/app/pricing/_data` — 7 symbols (typescript)
- `src/app/resources/blogs` — 7 symbols (typescript)
- `src/app/resources/blogs/_data` — 7 symbols (typescript)

## Extraction Quality

- Files parsed: **149** / 213 seen (0 file(s) + 3 directory tree(s) skipped by ignore globs)
- Parse errors: 0

## Architecture Pattern

**Architecture pattern: nextjs** (confidence: 95%)

Recognised nextjs from directory names: 61 of 63 typescript modules classified — 98% of this repository's 64 modules. All 111 imports between ordered layers run inward; none run against the order.

Layer mapping:
- module "src/app" maps to layer "pages"
- module "src/app/about" maps to layer "pages"
- module "src/app/about/_data" maps to layer "pages"
- module "src/app/api/chat" maps to layer "pages"
- module "src/app/api/revalidate" maps to layer "pages"
- module "src/app/book-a-demo" maps to layer "pages"
- module "src/app/book-a-demo/_components" maps to layer "pages"
- module "src/app/book-a-demo/_data" maps to layer "pages"
- module "src/app/book-a-demo/thank-you" maps to layer "pages"
- module "src/app/book-a-demo/thank-you/_components" maps to layer "pages"
- module "src/app/book-a-demo/thank-you/_data" maps to layer "pages"
- module "src/app/contact-sales" maps to layer "pages"
- … and 49 more (query_insights(explainer="layers") for all)

## How to Add a Feature

This code is laid out as **nextjs**. A dependency runs from an outer layer to an inner one, so a feature is built inward:

1. **pages** — e.g. `src/app`
2. **components** — e.g. `src/components/chat`
3. **hooks** — e.g. `src/hooks`
4. **lib, types** — e.g. `src/lib`

## Entry Points

29 routes, 15 shown:
- **route** ALL `/api/chat` (src/app/api/chat/route.ts)
- **route** ALL `/api/revalidate` (src/app/api/revalidate/route.ts)
- **route** GET `/` (src/app/layout.tsx)
- **route** GET `/` (src/app/page.tsx)
- **route** GET `/about` (src/app/about/page.tsx)
- **route** GET `/book-a-demo/thank-you` (src/app/book-a-demo/thank-you/page.tsx)
- **route** GET `/book-a-demo` (src/app/book-a-demo/page.tsx)
- **route** GET `/contact-sales` (src/app/contact-sales/page.tsx)
- **route** GET `/contact-us` (src/app/contact-us/page.tsx)
- **route** GET `/legal/acceptable-use` (src/app/legal/acceptable-use/page.tsx)
- **route** GET `/legal/cookies` (src/app/legal/cookies/page.tsx)
- **route** GET `/legal/copyright` (src/app/legal/copyright/page.tsx)
- **route** GET `/legal/disclaimer` (src/app/legal/disclaimer/page.tsx)
- **route** GET `/legal/privacy` (src/app/legal/privacy/page.tsx)
- **route** GET `/legal/terms` (src/app/legal/terms/page.tsx)
- … and 14 more (query_facts(kind="route") for all)

## Routes

| Method | Path | File | Type |
|--------|------|------|------|
| GET | `/` | `src/app/layout.tsx` | layout |
| GET | `/` | `src/app/page.tsx` | page |
| GET | `/about` | `src/app/about/page.tsx` | page |
| ALL | `/api/chat` | `src/app/api/chat/route.ts` | route |
| POST | `/api/chat` | `src/components/chat/ChatProvider.tsx` |  |
| ALL | `/api/revalidate` | `src/app/api/revalidate/route.ts` | route |
| GET | `/book-a-demo` | `src/app/book-a-demo/page.tsx` | page |
| GET | `/book-a-demo/thank-you` | `src/app/book-a-demo/thank-you/page.tsx` | page |
| GET | `/contact-sales` | `src/app/contact-sales/page.tsx` | page |
| GET | `/contact-us` | `src/app/contact-us/page.tsx` | page |
| GET | `/legal/acceptable-use` | `src/app/legal/acceptable-use/page.tsx` | page |
| GET | `/legal/cookies` | `src/app/legal/cookies/page.tsx` | page |
| GET | `/legal/copyright` | `src/app/legal/copyright/page.tsx` | page |
| GET | `/legal/disclaimer` | `src/app/legal/disclaimer/page.tsx` | page |
| GET | `/legal/privacy` | `src/app/legal/privacy/page.tsx` | page |
| GET | `/legal/terms` | `src/app/legal/terms/page.tsx` | page |
| GET | `/pricing` | `src/app/pricing/page.tsx` | page |
| GET | `/resources` | `src/app/resources/page.tsx` | page |
| GET | `/resources/blogs` | `src/app/resources/blogs/layout.tsx` | layout |
| GET | `/resources/blogs` | `src/app/resources/blogs/loading.tsx` | loading |
| GET | `/resources/blogs` | `src/app/resources/blogs/page.tsx` | page |
| GET | `/resources/blogs/[slug]` | `src/app/resources/blogs/[slug]/page.tsx` | page |
| GET | `/resources/case-studies` | `src/app/resources/case-studies/page.tsx` | page |
| GET | `/resources/faqs` | `src/app/resources/faqs/page.tsx` | page |
| GET | `/resources/whitepapers` | `src/app/resources/whitepapers/page.tsx` | page |
| GET | `/solutions` | `src/app/solutions/page.tsx` | page |
| GET | `/solutions/digital-agencies` | `src/app/solutions/digital-agencies/page.tsx` | page |
| GET | `/solutions/manufacturing` | `src/app/solutions/manufacturing/page.tsx` | page |
| GET | `/solutions/pharmaceutical` | `src/app/solutions/pharmaceutical/page.tsx` | page |

## Dependency Rules

- `src/app/api/chat` -> `src/types`
- `src/app/contact-sales` -> `src/hooks`
- `src/app/contact-us` -> `src/hooks`
- `src/app/legal` -> `src/lib`
- `src/app/resources/blogs` -> `src/lib`
- `src/app/resources` -> `src/lib`
- `src/app/solutions/pharmaceutical/_components` -> `src/app/solutions/pharmaceutical/_data`
- `src/app/solutions` -> `src/lib`
- `src/app` -> `src/lib`
- `src/components/chat` -> `src/types`
- `src/components/sections` -> `src/types`
- `src/components` -> `src/components/chat`
- `src/components` -> `src/hooks`
- `src/components` -> `src/lib`
- `src` -> `src/lib`

## Critical Modules

| Module | Fan-In | Fan-Out | Criticality |
|--------|--------|---------|-------------|
| `src/app/solutions/pharmaceutical/_components` | 0 | 17 | high |
| `src/app/solutions/pharmaceutical/_data` | 17 | 0 | high |
| `src/lib` | 9 | 0 | medium |
| `src/types` | 4 | 0 | low |
| `src/hooks` | 3 | 0 | low |
| `src/app/resources/blogs` | 0 | 2 | low |
| `src/components/chat` | 1 | 1 | low |
| `src/components/sections` | 0 | 2 | low |
| `src/app` | 0 | 1 | low |
| `src/app/api/chat` | 0 | 1 | low |

---

*Generated at 2026-10-08T15:02:57Z in 2.1590722s. 1493 facts, 46 insights.*
