# Architecture Snapshot

## Repository Map

| Module | Language | Symbols | Exported |
|--------|----------|---------|----------|
| `.` | typescript | 5 | 3 |
| `scripts` | typescript | 9 | 0 |
| `src/app` | typescript | 22 | 12 |
| `src/app/about` | typescript | 2 | 2 |
| `src/app/about/_data` | typescript | 1 | 1 |
| `src/app/api/chat` | typescript | 5 | 2 |
| `src/app/api/revalidate` | typescript | 1 | 1 |
| `src/app/contact-sales` | typescript | 2 | 2 |
| `src/app/contact-sales/_components` | typescript | 6 | 2 |
| `src/app/contact-sales/_data` | typescript | 4 | 4 |
| `src/app/contact-us` | typescript | 2 | 2 |
| `src/app/contact-us/_components` | typescript | 3 | 1 |
| `src/app/contact-us/_data` | typescript | 4 | 4 |
| `src/app/legal/_components` | typescript | 6 | 2 |
| `src/app/legal/_data` | typescript | 12 | 12 |
| `src/app/legal/acceptable-use` | typescript | 3 | 2 |
| `src/app/legal/acceptable-use/_data` | typescript | 1 | 1 |
| `src/app/legal/cookies` | typescript | 3 | 2 |
| `src/app/legal/cookies/_data` | typescript | 2 | 1 |
| `src/app/legal/copyright` | typescript | 3 | 2 |
| `src/app/legal/copyright/_data` | typescript | 2 | 1 |
| `src/app/legal/disclaimer` | typescript | 3 | 2 |
| `src/app/legal/disclaimer/_data` | typescript | 1 | 1 |
| `src/app/legal/privacy` | typescript | 3 | 2 |
| `src/app/legal/privacy/_data` | typescript | 3 | 1 |
| `src/app/legal/terms` | typescript | 3 | 2 |
| `src/app/legal/terms/_data` | typescript | 2 | 1 |
| `src/app/pricing` | typescript | 2 | 2 |
| `src/app/pricing/_components` | typescript | 15 | 4 |
| `src/app/pricing/_data` | typescript | 7 | 7 |
| `src/app/resources` | typescript | 2 | 2 |
| `src/app/resources/_data` | typescript | 1 | 1 |
| `src/app/resources/blogs` | typescript | 7 | 4 |
| `src/app/resources/blogs/[slug]` | typescript | 6 | 5 |
| `src/app/resources/blogs/_components` | typescript | 26 | 6 |
| `src/app/resources/blogs/_data` | typescript | 7 | 7 |
| `src/app/resources/case-studies` | typescript | 2 | 2 |
| `src/app/resources/case-studies/_data` | typescript | 1 | 1 |
| `src/app/resources/faqs` | typescript | 1 | 1 |
| `src/app/resources/whitepapers` | typescript | 2 | 2 |
| `src/app/resources/whitepapers/_data` | typescript | 1 | 1 |
| `src/app/solutions` | typescript | 2 | 2 |
| `src/app/solutions/_data` | typescript | 1 | 1 |
| `src/app/solutions/digital-agencies` | typescript | 2 | 2 |
| `src/app/solutions/digital-agencies/_data` | typescript | 1 | 1 |
| `src/app/solutions/manufacturing` | typescript | 2 | 2 |
| `src/app/solutions/manufacturing/_data` | typescript | 1 | 1 |
| `src/app/solutions/pharmaceutical` | typescript | 8 | 6 |
| `src/app/solutions/pharmaceutical/_components` | typescript | 87 | 10 |
| `src/app/solutions/pharmaceutical/_data` | typescript | 43 | 43 |
| `src/components/chat` | typescript | 14 | 4 |
| `src/components/layout` | typescript | 31 | 5 |
| `src/components/sections` | typescript | 115 | 20 |
| `src/components/ui` | typescript | 17 | 10 |
| `src/hooks` | typescript | 8 | 2 |
| `src/lib` | typescript | 61 | 34 |
| `src/types` | typescript | 26 | 25 |
| `wordpress` | php | 5 | 5 |

## Extraction Quality

- Files parsed: **140** / 204 seen (0 file(s) + 3 directory tree(s) skipped by ignore globs)
- Parse errors: 0

## Architecture Pattern

**Architecture pattern: nextjs** (confidence: 95%)

Recognised nextjs from directory names: 55 of 57 typescript modules classified — 98% of this repository's 58 modules. All 106 imports between ordered layers run inward; none run against the order.

Layer mapping:
- module "src/app" maps to layer "pages"
- module "src/app/about" maps to layer "pages"
- module "src/app/about/_data" maps to layer "pages"
- module "src/app/api/chat" maps to layer "pages"
- module "src/app/api/revalidate" maps to layer "pages"
- module "src/app/contact-sales" maps to layer "pages"
- module "src/app/contact-sales/_components" maps to layer "pages"
- module "src/app/contact-sales/_data" maps to layer "pages"
- module "src/app/contact-us" maps to layer "pages"
- module "src/app/contact-us/_components" maps to layer "pages"
- module "src/app/contact-us/_data" maps to layer "pages"
- module "src/app/legal/_components" maps to layer "pages"
- … and 43 more (query_insights(explainer="layers") for all)

## How to Add a Feature

This code is laid out as **nextjs**. A dependency runs from an outer layer to an inner one, so a feature is built inward:

1. **pages** — e.g. `src/app`
2. **components** — e.g. `src/components/chat`
3. **hooks** — e.g. `src/hooks`
4. **lib, types** — e.g. `src/lib`

## Entry Points

27 routes, 15 shown:
- **route** ALL `/api/chat` (src/app/api/chat/route.ts)
- **route** ALL `/api/revalidate` (src/app/api/revalidate/route.ts)
- **route** GET `/` (src/app/layout.tsx)
- **route** GET `/` (src/app/page.tsx)
- **route** GET `/about` (src/app/about/page.tsx)
- **route** GET `/contact-sales` (src/app/contact-sales/page.tsx)
- **route** GET `/contact-us` (src/app/contact-us/page.tsx)
- **route** GET `/legal/acceptable-use` (src/app/legal/acceptable-use/page.tsx)
- **route** GET `/legal/cookies` (src/app/legal/cookies/page.tsx)
- **route** GET `/legal/copyright` (src/app/legal/copyright/page.tsx)
- **route** GET `/legal/disclaimer` (src/app/legal/disclaimer/page.tsx)
- **route** GET `/legal/privacy` (src/app/legal/privacy/page.tsx)
- **route** GET `/legal/terms` (src/app/legal/terms/page.tsx)
- **route** GET `/pricing` (src/app/pricing/page.tsx)
- **route** GET `/resources/blogs/[slug]` (src/app/resources/blogs/[slug]/page.tsx)
- … and 12 more (query_facts(kind="route") for all)

## Routes

| Method | Path | File | Type |
|--------|------|------|------|
| GET | `/` | `src/app/layout.tsx` | layout |
| GET | `/` | `src/app/page.tsx` | page |
| GET | `/about` | `src/app/about/page.tsx` | page |
| ALL | `/api/chat` | `src/app/api/chat/route.ts` | route |
| POST | `/api/chat` | `src/components/chat/ChatProvider.tsx` |  |
| ALL | `/api/revalidate` | `src/app/api/revalidate/route.ts` | route |
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
- `src/components` -> `src/lib`
- `src` -> `src/lib`

## Critical Modules

| Module | Fan-In | Fan-Out | Criticality |
|--------|--------|---------|-------------|
| `src/app/solutions/pharmaceutical/_components` | 0 | 17 | high |
| `src/app/solutions/pharmaceutical/_data` | 17 | 0 | high |
| `src/lib` | 9 | 0 | medium |
| `src/types` | 4 | 0 | low |
| `src/app/resources/blogs` | 0 | 2 | low |
| `src/components/chat` | 1 | 1 | low |
| `src/components/sections` | 0 | 2 | low |
| `src/hooks` | 2 | 0 | low |
| `src/app` | 0 | 1 | low |
| `src/app/api/chat` | 0 | 1 | low |

---

*Generated at 2026-10-05T21:05:39Z in 315.7651ms. 1422 facts, 44 insights.*
