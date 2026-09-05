# SEO — why the site wasn't ranking, and how it's wired now

_Last updated: 2026-08-24_

> **Status check, 2026-08-18.** The August 7 technical fixes are live and
> verified against production: `robots.txt` and `sitemap.xml` both serve the
> correct host, the home page carries a self-referencing canonical, and the
> `Organization` / `WebSite` / `SoftwareApplication` graph renders on every page.
>
> The query has moved from _"Showing results for spendesk"_ to
> _"**Did you mean:** spendesk"_ — Google now accepts "expendesk" as a real word
> and returns results for it. But the results it returns are LinkedIn posts, not
> this site. Two things are still missing, one fixed in this round and one that
> cannot be fixed from the repository:
>
> 1. **No page on the site was about the brand.** Fixed — see
>    [Round 2](#round-2--brand-entity-2026-08-18).
> 2. **The site is almost certainly not in Search Console.** Not fixable here.
>    This is now the single biggest blocker — see
>    [Actions still required](#actions-still-required).

## TL;DR

Searching **"expendesk"** on Google returned _"Showing results for **spendesk**"_ and the
real site never appeared. That was not a ranking problem, it was an **identity**
problem: the live site was telling Google it lived at
`https://expendesk-v1.vercel.app`, not at `expendesk.com`.

The code fixes in this change make the site declare the correct domain
everywhere and publish a machine-readable claim to the brand name. **Two
manual steps outside the codebase are still required** — see
[Actions still required](#actions-still-required). Without those, the code
changes alone will not get the site indexed quickly.

---

## What was actually broken

Diagnosed by fetching the live production site as Googlebot on 2026-08-06.

### 1. The canonical domain was wrong everywhere (critical)

`NEXT_PUBLIC_SITE_URL` was set on the hosting platform to
`https://expendesk-v1.vercel.app/` — the wrong host, **and** with a trailing
slash. Every absolute URL on the site is built from that value, so the live
site was serving:

```
# https://www.expendesk.com/robots.txt
Sitemap: https://expendesk-v1.vercel.app//sitemap.xml     ← wrong host + "//"

# https://www.expendesk.com/sitemap.xml
<loc>https://expendesk-v1.vercel.app//pricing</loc>       ← wrong host + "//"
<loc>https://expendesk-v1.vercel.app//contact-us</loc>
… every URL, including every blog post

# <head> on every page
<meta property="og:url" content="https://expendesk-v1.vercel.app"/>
<meta property="og:image" content="https://expendesk-v1.vercel.app/opengraph-image…"/>
```

The sitemap is how a crawler discovers a new site. This one pointed at a
different domain, and the URLs inside it were double-slashed. The one document
whose entire job is "here is my site" was describing somewhere else.

### 2. No `rel="canonical"` on any marketing page (critical)

Only `/resources/blogs/[slug]` declared a canonical. The home page, `/pricing`,
`/contact-us`, `/contact-sales` and all three `/solutions/*` pages declared
none.

This mattered because a byte-identical copy of the site is also served at
`expendesk-v1.vercel.app`, and that host returned **no `X-Robots-Tag`** — it was
fully crawlable. Two indexable domains, identical content, and nothing telling
Google which one is real.

### 3. No brand entity data (this is the "did you mean spendesk" cause)

The only structured data on the site was a `FAQPage` block. There was no
`Organization` and no `WebSite` schema — nothing anywhere asserting that
"Expendesk" is the name of a company that owns this domain.

A spelling correction fires when Google has no confident entity for the typed
string but a very strong one for a near-identical string. "Spendesk" is a
well-known funded company; "Expendesk" was, to Google, an unrecognised string
with no corroborating signals. Google wasn't ranking the site badly — it was
not convinced the word existed.

### 4. Smaller issues

- Titles on `/solutions/*` read `"… | Expendesk"`, and the root layout's title
  template appends `" — Expendesk"` — so the rendered title was
  `"Expense Management for Manufacturing Industries | Expendesk — Expendesk"`.
- `/resources/blogs?page=2` and `?category=X` produced crawlable near-duplicate
  URLs with no canonical to disambiguate them.
- `/resources/faqs` issued a **307** (temporary) redirect for a permanent move,
  so Google was asked to keep re-checking a dead URL forever.
- No Google Search Console verification hook existed.

---

## What changed in the code

No visual, layout, or copy-on-page changes. Everything below is `<head>`,
HTTP headers, or generated `.txt`/`.xml` files.

| File | Change |
| --- | --- |
| [src/lib/site.ts](../src/lib/site.ts) | Canonical origin is now **pinned in code** to `https://www.expendesk.com`, normalised through the URL parser (no trailing slash), with `*.vercel.app` and friends rejected as canonical origins. Adds `absoluteUrl()`, `SOCIAL_PROFILES`, `IS_INDEXABLE_DEPLOY`, `GOOGLE_SITE_VERIFICATION`. |
| [src/lib/structured-data.ts](../src/lib/structured-data.ts) | **New.** `Organization` + `WebSite` + `SoftwareApplication` JSON-LD in one cross-linked `@graph`. |
| [src/app/layout.tsx](../src/app/layout.tsx) | Renders the entity graph; adds `applicationName`/`publisher`, explicit `robots` directives (`max-image-preview:large`), and an optional Search Console verification tag. |
| [src/app/page.tsx](../src/app/page.tsx) | Gains a `metadata` export declaring `canonical: "/"` (it previously had none at all). |
| `pricing`, `contact-us`, `contact-sales`, `solutions/*` | `alternates.canonical` added; duplicated brand suffix removed from the three solutions titles. |
| [src/app/resources/blogs/page.tsx](../src/app/resources/blogs/page.tsx) | Static `metadata` → `generateMetadata`, so `?page=N` self-canonicals and `?category=X` folds into the bare listing. |
| [src/app/resources/faqs/page.tsx](../src/app/resources/faqs/page.tsx) | `redirect` → `permanentRedirect` (307 → 308). |
| [src/app/robots.ts](../src/app/robots.ts) | Correct `Sitemap:` URL, adds `Host:`, and serves a disallow-all on non-production deploys. |
| [src/app/sitemap.ts](../src/app/sitemap.ts) | All URLs built via `absoluteUrl()`; adds `lastModified` to static routes. |
| [next.config.ts](../next.config.ts) | `X-Robots-Tag: noindex, nofollow` for any `*.vercel.app` host. |

### Why the origin is hardcoded rather than read from an env var

The brand's canonical origin is a constant, not a per-deploy value. Leaving it
in an env var is what allowed a preview URL to silently become the canonical
domain for the whole site. It now lives in code where it is reviewed and
versioned; `NEXT_PUBLIC_SITE_URL` still works as an override, but **only** if it
names a plausible canonical host. A `*.vercel.app` value can never win again.

### Why `www` and not the apex

`https://expendesk.com` issues a **308 to `https://www.expendesk.com`**
(verified). A canonical URL must be the *destination* of a redirect, never the
source — otherwise every canonical tag points at a redirect hop. If you ever
switch the site to serve the apex directly, change `PRODUCTION_ORIGIN` in
`src/lib/site.ts` in the same commit.

### A note on `meta keywords`

The `keywords` meta tag was dropped from the root layout. Google has ignored it
since 2009; it has no effect on ranking either way.

---

## Round 2 — brand entity (2026-08-18)

The first round made the site *technically correct*. It was still not
*findable*, and re-checking production surfaced why.

### The gap: nothing on the site was about the brand

Every page sold the product to someone who already knew the name. The home page
H1 reads "Take Control of Every Business Expense Without the Spreadsheet Chaos"
— the brand does not appear in it. `/pricing`, `/contact-us` and the three
`/solutions/*` pages are all about *what the product does*.

Nothing answered **"what is Expendesk?"**. So for a query that is nothing but
the brand name, Google had no page to rank, and no passage to quote in an AI
overview or featured snippet. It quoted LinkedIn instead — which is exactly what
the current SERP shows.

### The asset that wasn't being used: Elogix

Google's own AI Overview for "expendesk" describes it as _"an AI-powered expense
management tool built for growing businesses in India by **Elogix Software**"_.
Google already knows who makes this product — it learned it from LinkedIn.

**The site never said so.** A 25-year-old company with its own indexed domain
([elogixsoft.com](https://www.elogixsoft.com/)), a LinkedIn company page and a
Crunchbase profile stands behind this brand, and none of that credibility was
being claimed on-domain. That is the corroboration a coined word needs.

### What changed

| File | Change |
| --- | --- |
| [src/app/about/page.tsx](../src/app/about/page.tsx) | **New.** `/about` — the brand entity page. H1 is literally "What is Expendesk?"; the definition, the spelling, the parent company and the official channels are all stated in prose. Pure server component, no client JS, no fade-in. |
| [src/app/about/_data/content.ts](../src/app/about/_data/content.ts) | Its copy, with the editing rules that keep it aligned with the structured data. |
| [src/lib/site.ts](../src/lib/site.ts) | Adds `PARENT_ORGANIZATION` (Elogix, verified against live sources) and `BRAND_ALTERNATE_NAMES`. |
| [src/lib/structured-data.ts](../src/lib/structured-data.ts) | `Organization` gains `parentOrganization` + `disambiguatingDescription`; a second `Organization` node describes Elogix with its own `url` and `sameAs`; adds the reusable `webPageStructuredData()` helper. |
| [src/app/sitemap.ts](../src/app/sitemap.ts) | `/about` added at priority 0.9. |
| [src/data/footer.json](../src/data/footer.json) | "About Expendesk" added to Quick Links, so the page has a sitewide internal link. |

### Why `/about` is built differently from every other page

It renders as plain server-side HTML with no animation. The rest of the site
initialises content at `opacity: 0` and fades it in on hydration — there are
**180 `opacity:0` elements in the home page's server HTML**. Google does execute
JavaScript, so this generally resolves, but on the one page whose entire purpose
is to be read by a crawler on a domain with almost no crawl history, text that
needs JS to become visible is a risk with no upside.

### Why the disambiguation never names Spendesk

`disambiguatingDescription` asserts a positive identity — who owns the name, who
publishes the product. It deliberately does **not** say "not to be confused with
Spendesk". Putting a competitor's brand into this site's entity data invites the
association it is trying to break; only a positive claim separates two entities.

---

## Round 4 — SEO team's homepage spec (2026-08-24)

An external SEO team supplied a full `<head>` block and four JSON-LD payloads to
implement on the home page. Most of it was sound and is now live. Four items
were **not** implemented, and three were implemented with corrected values.

This section records the whole audit, because "why didn't you add the bit about
pricing?" is a question that will otherwise be asked again in three months.

### Implemented as specified

| Item | Where |
| --- | --- |
| Home page `<title>` + `description` | [page.tsx](../src/app/page.tsx) |
| `og:url` matching the canonical, per page | [page-metadata.ts](../src/lib/page-metadata.ts) |
| `format-detection: telephone=no` | [layout.tsx](../src/app/layout.tsx) |
| FAQPage expanded 5 to 8 questions | [faq.json](../src/data/sections/faq.json) |
| `foundingDate` on both Organization nodes | [structured-data.ts](../src/lib/structured-data.ts) |
| Updated `featureList`, WebSite description | [structured-data.ts](../src/lib/structured-data.ts) |

Already present before this round and verified unchanged: `charset`, `viewport`,
`canonical`, `robots`, `googlebot` (with `max-image-preview:large`), all Twitter
card tags, `author`, `publisher`, `application-name`, `theme-color`.

### Implemented, with corrected values

| Spec said | Reality | Now |
| --- | --- | --- |
| `telephone`, `streetAddress`, `postalCode` set to `[CONFIRM WITH MARKETING]` | Literal placeholder strings that would have shipped as-is | Real verified values from `BUSINESS_ADDRESS` (added Round 3) |
| `logo: width 512, height 512` | `public/logo.png` is **1423x458**, a wordmark | Real measured dimensions |
| `operatingSystem: "Web, iOS, Android"` | **No mobile app exists.** No App Store or Play Store link anywhere in the repo; the only Android references are PWA manifest icons | `"Web"` |

### Not implemented, and why

**1. `AggregateOffer` (lowPrice 3999 / highPrice 7999 / offerCount 3) — rejected.**

This is the highest-risk item in the spec. Those numbers come from
`src/app/pricing/_data/content.ts`, which states at the top of the file that plan
prices are **PLACEHOLDER data**, and renders each plan with the visible note
"Billed annually · placeholder pricing".

Google's structured-data policy requires prices in markup to match what the user
sees. Price markup is rich-result-eligible, which is exactly the category that
draws manual actions when it misrepresents — and it publishes a number the
business has not committed to into a format aggregators scrape and cache.

The shape the spec proposed is correct. Add it in the same commit that replaces
the placeholder pricing with real launched figures. The full reasoning is inline
in [structured-data.ts](../src/lib/structured-data.ts) so it is found at the
moment someone tries to add it.

**2. `VideoObject` — rejected, and the underlying asset is broken.**

The spec marks up a video at `/video/product-tour.mp4` with poster
`/video/tour-poster.jpg` and duration `PT2M30S`. None of that exists. What the
home page actually references is:

```
https://youngarchitects.in/assets/client/expendesk/feat-video.mkv
```

Two separate problems, both real:

- **It returns HTTP 404.** The product tour video on the live home page does not
  load at all.
- **It is `.mkv`** — a container no browser can play in a `<video>` element.
  `FeaturesVideo.tsx` already logs a dev warning about exactly this.

`VideoObject` requires a real `thumbnailUrl` and a resolvable `contentUrl`.
Marking up a 404 would put an error in Search Console and nothing on the SERP.

**Fix the asset first**: re-encode to MP4 (H.264/AAC), host it at a URL that
resolves, add a poster image, and set `featureVideoUrl` in
`src/data/sections/features.json`. Then add the `VideoObject` — with the real
duration, not `PT2M30S`. This is a genuine bug worth fixing regardless of SEO:
a headline product-tour video is currently dead on the home page.

**3. Hardcoded icon and manifest links — rejected as unnecessary and broken.**

The spec lists `/icon.svg`, `/apple-touch-icon.png` and `/site.webmanifest`.
None of those paths exist in this project, so all three would 404.

Next generates these from file conventions in `src/app/` and already emits them
with content-hashed URLs that stay valid across deploys: `/manifest.webmanifest`,
`/favicon.ico` (48x48), `/icon0.png` (16x16), `/icon1.png` (32x32) and
`/apple-icon.png` (180x180).

**4. Hardcoded `og:image` at `/og/home.png` — rejected, same reason.**

That file does not exist. `opengraph-image.tsx` and `twitter-image.tsx` already
generate the images and Next injects the complete tag set automatically —
`og:image`, `:type`, `:width` (1200), `:height` (630) and `:alt`. Adding the
spec's block would have produced duplicate tags pointing at a 404.

`og:image:secure_url` is also skipped: it is a legacy Facebook field, redundant
when `og:image` is already an https URL.

### Two bugs found while implementing

**`og:url` was wrong on every page except the home page.** The spec's own
comment — "og:url MUST equal the canonical above. Never hardcode this sitewide"
— was correct, and the site was doing exactly the wrong thing. `/pricing` shipped
a canonical of `https://www.expendesk.com/pricing` alongside an `og:url` of
`https://www.expendesk.com`.

Cause: `openGraph` is one of the few metadata fields Next replaces *wholesale*
rather than merging. Pages that set `alternates.canonical` without redeclaring
the entire `openGraph` object inherited the root layout's home-page URL.

Fixed by [`pageMetadata()`](../src/lib/page-metadata.ts), which takes `path`
once and derives both values from it. All eight static routes now match.

**The home page `<title>` silently lost the brand name.** Applying the spec's
title verbatim rendered a title of "Expense Management Software for Growing
Businesses" — with no "Expendesk" anywhere.

Cause: `title.template` applies only to **child** route segments. `app/page.tsx`
is the page for the root segment, the same one `app/layout.tsx` declares the
template in, so the `" — Expendesk"` suffix is never appended there. Every other
route gets it automatically; the home page must carry it in the string.

On a site whose entire problem is that Google does not recognise the brand,
dropping it from the single most weighted element would have actively worked
against the previous three rounds. The title now reads
"Expense Management Software for Growing Businesses — Expendesk".

### Needs confirmation from marketing

Two FAQ answers assert product capabilities that could not be verified anywhere
in the codebase. They are live as the SEO team wrote them, but they are claims,
not facts that were checked:

- "Expendesk connects to existing accounting systems..." — also now listed as
  `Accounting integrations` in the SoftwareApplication `featureList`.
- "Most teams are live within days rather than months."

If either is aspirational rather than shipped, edit `faq.json` — the visible
page and the FAQ markup both regenerate from it.

### Why FAQ content lives in one file

`FaqSection.tsx` renders the visible accordion **and** builds the `FAQPage`
JSON-LD from the same `faq.json` array. Google requires FAQ markup to match the
answer text visible on the page; deriving both from one source makes a mismatch
impossible. Never hand-write a parallel FAQ block in structured data — the
verification step below checks this automatically.

> **Worth knowing:** Google deprecated FAQ rich results in August 2023 — this
> markup no longer produces the expandable SERP accordion for most sites. It is
> retained because it still feeds AI overviews and answer extraction, and
> because it costs nothing. Do not expect a visual SERP change from it.

---

## Round 5 — /solutions/pharmaceutical (2026-08-25)

The SEO team supplied a `<head>` block plus `Service` and `FAQPage` payloads for
the pharmaceutical landing page. Implemented, with one structural change the
brief did not anticipate and one deviation on the title.

### The structural change: the FAQ needed a page section, not just markup

The brief supplied six Q&As as `FAQPage` JSON-LD. **The page had no FAQ section
at all** — the only "questions" on it belong to the interactive self-assessment
widget, which is a scoring quiz, not an FAQ.

Marking up six answers that appear nowhere on the page is a structured-data
policy violation: Google requires FAQ markup to match text the visitor can read.
The options were to drop the markup or to add the content.

The content was added. These are real buyer questions, the page was missing an
FAQ entirely, and shipping them gives the page both the markup and the substance
the markup claims. Same single-source pattern as the home page:

| File | Role |
| --- | --- |
| [`_data/faq.ts`](../src/app/solutions/pharmaceutical/_data/faq.ts) | The six entries — the only place they exist |
| [`_components/FaqSection.tsx`](../src/app/solutions/pharmaceutical/_components/FaqSection.tsx) | Renders the accordion **and** builds the `FAQPage` JSON-LD from the same array |

`npm run verify:seo` asserts every marked-up question appears in the rendered
HTML, so this cannot silently drift.

#### Why that section has no client JavaScript

Every other section on this page is `'use client'` with Framer Motion, two with
GSAP as well. The FAQ is a plain server component using native
`<details>`/`<summary>`.

The answers are the whole point of the section — they are the text the FAQPage
markup asks Google to trust. Routing them through a client component with a
scroll-triggered `opacity: 0` entrance would make the page's most
SEO-load-bearing copy depend on hydration for no gain. `<details>` keeps all six
answers in the server HTML, collapsed visually but always in the DOM, with
correct keyboard and screen-reader behaviour for free.

### The title deviation

The brief asked for:

```html
<title>Pharma Expense Management Software | Expendesk</title>
```

Setting that string in `page.tsx` would have rendered:

```
Pharma Expense Management Software | Expendesk — Expendesk
```

The root layout's `template: "%s — Expendesk"` appends the brand to every child
route. So the brand is omitted from the string and the template supplies it:

```
Pharma Expense Management Software — Expendesk      (45 chars)
```

The brief's intent — keyword head first, shorter than the previous 59-character
title — with one brand mention and the site's standard separator. Description is
now 149 characters, down from 172, so it renders without truncation.

### `og:image` — built rather than declared

The brief pointed `og:image` at
`https://www.expendesk.com/og/solutions-pharmaceutical.png`, which does not
exist. Rather than drop it, the card is now generated:

- [`opengraph-image.tsx`](../src/app/solutions/pharmaceutical/opengraph-image.tsx) — page-specific 1200x630 card
- `twitter-image.tsx` — re-exports it, so `og:image` and `twitter:image` never
  show different cards for the same URL

Next wires `og:image`, `:width`, `:height`, `:type` and `:alt` automatically for
the segment. This gives the brief what it wanted — a page-specific share image
instead of the generic site card — with no hardcoded path that can rot.

### `Service` schema

Implemented via the reusable
[`serviceStructuredData()`](../src/lib/structured-data.ts) helper, so the two
sibling solutions pages can adopt it without duplication.

One change from the supplied payload: `provider` is an `@id` reference to the
Organization node the root layout already emits, rather than a repeated inline
object. That attaches the service to the entity Google is being asked to
recognise as "Expendesk", instead of introducing a second unconnected company
with the same name.

All `Offer` nodes are **price-free**, and must stay that way while
`pricing/_data/content.ts` is placeholder — see the Round 4 note. A price-free
Offer validly states a capability is available and claims nothing about cost.

`BreadcrumbList` (Home > Solutions > Pharmaceutical) added alongside it.

### Not implemented

The `<head>` block also listed `/favicon.ico`, `/icon.svg`,
`/apple-touch-icon.png` and `/site.webmanifest`. Rejected for the third time,
same reason: those paths do not exist, and Next already emits the correct icon
links with content-hashed URLs from the file conventions in `src/app/`. See
Round 4 and the icons section.

### Claims to verify with product

Three answers assert capabilities not confirmed anywhere in this repository.
They are live as the SEO team wrote them, but they are claims:

- **Duplicate detection** running automatically at submission
- **Per-territory policies** and approval routing
- **"Live within days"** implementation (same claim as the home page FAQ)

One more worth a look: `field-submission` says reps submit "from mobile, web or
upload". True of the mobile web app — but there is no native iOS/Android app,
and `SoftwareApplication` correctly declares `operatingSystem: "Web"`. If
marketing means a native app, the schema needs updating, not the copy.

All four are edited in one place: `_data/faq.ts`. The visible page and the
markup regenerate together.

---

## Reading Search Console: which "errors" are not errors

Search Console's Page Indexing report lists every URL Google did **not** index,
including every URL you deliberately told it not to index. Rows in that report
are statuses, not defects. Three separate reports from this site have been
escalated as bugs when two of them were the system working correctly.

Check this table before "fixing" anything the report surfaces.

| Report row | URLs here | Verdict |
| --- | --- | --- |
| **Page with redirect** | `http://expendesk.com/`, `https://expendesk.com/` | **Correct — do not fix.** The apex 308-redirects to `www`, which is the entire canonical strategy. Google excludes the source of a redirect and indexes the destination. Removing the redirect would split ranking signals across two hostnames. |
| **Excluded by 'noindex' tag** | `/resources`, `/resources/case-studies`, `/resources/whitepapers`, `/solutions` | **Correct — do not fix.** All four are "Coming Soon" placeholders containing a single sentence. The tag is deliberate (`robots: { index: false, follow: true }`). Indexing near-empty pages is a quality negative, burns crawl budget, and Google would likely refuse them anyway as "Crawled – currently not indexed". Remove the tag in the same commit that adds real content, never before. |
| **Video indexing / unsupported format** | `feat-video.mkv` | **A real bug.** See Round 4 — the file 404s and `.mkv` is not a browser-playable container. |

### The rows that *would* matter

If any of these appear for `https://www.expendesk.com/` or another page that is
meant to rank, they are worth acting on:

- **"Discovered – currently not indexed"** — Google knows the URL exists but has
  not crawled it. Usually a crawl-budget/authority signal on a young domain.
  Request indexing and build inbound links.
- **"Crawled – currently not indexed"** — Google fetched the page and chose not
  to index it. A content-quality judgement, not a technical fault.
- **"Duplicate, Google chose a different canonical"** — the declared canonical is
  being overridden. On this site that would most likely mean the `*.vercel.app`
  copy is winning, which `next.config.ts` and the self-referencing canonicals
  are designed to make impossible. Investigate immediately if it appears.
- **"Blocked by robots.txt"** or **"noindex" on a page that should rank** — a
  genuine misconfiguration. `npm run verify:seo` plus a live header check will
  confirm.

### Rule of thumb

An exclusion is a defect only when the excluded URL is one you *want* indexed.
For every other row, Search Console is reporting that your instructions were
received and followed.

---

## Icons and favicon (2026-08-25)

Regenerate the whole set with:

```bash
npm run icons     # node scripts/generate-icons.mjs
npm run build     # picks up the new content hashes
```

### What was broken

The set was hand-exported once and had three defects, none visible without
inspecting pixels:

| File | Defect | Consequence |
| --- | --- | --- |
| `src/app/apple-icon.png` | 87% transparent, fully transparent corners | iOS does not support alpha in home-screen icons — it composites transparency to **black**. Adding Expendesk to an iPhone home screen produced a violet mark on a black square. |
| `public/android-chrome-*.png` | transparent, edge-to-edge | `manifest.ts` could only declare `purpose: "any"`; adaptive-icon launchers letterboxed instead of filling the shape. |
| `src/app/icon0.png` | peak alpha 221, never fully opaque | the 16px tab favicon rendered washed out. |

### The rule that was being missed

Transparency is correct for some icons and wrong for others:

- **Browser tab icons** — `favicon.ico`, `icon0.png`, `icon1.png` — **transparent**.
  Tab strips are light or dark depending on theme; a baked-in plate looks like a
  sticker on a dark tab.
- **Apple touch icon** — **opaque, always.** iOS renders alpha as black and adds
  its own rounded corners, so the source must be a full-bleed opaque square.
- **Android maskable** — **opaque, full-bleed**, mark confined to the centred
  safe-zone circle (80% of canvas). The launcher crops to an arbitrary shape, so
  bare corners or an oversized mark both fail.

### The master

`brand/expendesk-mark-master.png` — the isometric symbol, 512x512, transparent.
`brand/` is not served by Next and is never written by the generator, which is
what makes regeneration idempotent. The first version of the script read its
alpha master from `public/android-chrome-512x512.png`, one of its own outputs;
a second run would have baked an opaque plate into the tab icons.

**Do not use `public/expendesk-mark.jpg` as an icon source.** Despite the name it
is the *wordmark* — "ExpenDesk" set in type on a white circle, sized for a social
avatar. Generating icons from it yields a 180px square of unreadable
four-pixel-tall lettering.

### Google Search favicon

Google renders the icon beside a result from a separate pipeline to page
crawling, and caches it hard — it refreshes only when the home page is
recrawled and that pipeline runs. A generic globe in the SERP means "no favicon
fetched yet", not a markup error. Days to weeks of lag on a newly indexed site
is normal.

Google's guidance asks for a square that is a **multiple of 48px**. The .ico
tops out at 48, the bare minimum, so  (192x192 = 48x4) is
generated purely to give the search pipeline a larger source. Browsers still
pick 16/32 for the tab. It is transparent like the other tab icons, because
Google renders result favicons on light *and* dark backgrounds and a baked-in
plate would show as a visible tile in one of them.

### Clean, unhashed icon URLs

Next's file conventions emit every icon link with a content-hash query string
(`/favicon.ico?favicon.0zo1q079966bd.ico`). The hash is stable — verified
unchanged across rebuilds — and browsers handle it fine, but it left the home
page offering no plain canonical favicon URL.

`layout.tsx` now declares the full set in `metadata.icons` with clean paths,
plus a `rel="shortcut icon"` on `/favicon.ico`.

> **Careful:** declaring `metadata.icons` **overrides** Next's file-based icon
> tags. Adding only `shortcut` silently dropped `icon0`/`icon1`/`icon2` and the
> apple-touch-icon from the rendered head. The set must be declared in full or
> not at all — and the `sizes` values must match what
> `scripts/generate-icons.mjs` actually produces.

The trade-off is browser caching: without the hash a changed icon can serve
stale for a while. That is correct for a favicon — Google asks for a stable URL,
and stability matters more than instant propagation.

### Known limitation: 16px legibility

The symbol is 222x484 after trimming — an aspect ratio of about 0.46 — with fine
interior linework (the coin stacks and inner rules). Scaled into a 16x16 canvas
it fills the full height but occupies only **7 pixels of width**, and the
interior detail is gone.

That is inherent to the mark, not a generation fault; the icon is as faithful as
16px allows. The only real fix is a **simplified square glyph** drawn
specifically for small sizes — a designer's call, not something to approximate
here. At 32px and 48px the mark reads correctly, which covers the Google Search
result favicon (read at 48px) and hi-DPI tabs.

### An SVG favicon is deliberately absent

`icon.svg` would scale perfectly and is standard practice, but the brand mark
exists here only as raster. Hand-tracing a company's logo produces something
subtly wrong that then propagates everywhere. Ask the designer for the original
vector and drop it in at `src/app/icon.svg` — Next picks it up automatically, no
code change needed.

---

## Actions still required

The code is deployed-ready, but **indexing will not fix itself**. Nothing in
this repository can put the site into Google's index. These steps are the
difference between "correct" and "ranking".

### 1. Google Search Console — the single biggest blocker

**Do this before anything else on this list.** Two rounds of on-page work are
now live and the site still does not appear for its own name. The most likely
explanation is the simplest one: nobody has ever told Google the site exists.

Evidence it isn't set up: `https://www.expendesk.com/` serves **no
`google-site-verification` meta tag** (checked 2026-08-18), which means
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is unset. That is not proof — DNS
verification leaves no trace in the HTML — so **check the account first**. If a
property does exist, open **Pages** and read why URLs are excluded; that report
answers the question directly and makes the rest of this guesswork unnecessary.

If there is no property:

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
   and add a **Domain property** for `expendesk.com` (a domain property covers
   `www`, apex, http and https in one; a URL-prefix property does not).
2. Verify via DNS TXT record — add it wherever `expendesk.com`'s DNS is managed.
   - To verify with the HTML tag instead, set
     `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the token and redeploy; the
     layout emits the tag automatically.
3. **Sitemaps** → submit `https://www.expendesk.com/sitemap.xml`.
4. **URL Inspection** → **Request Indexing**, in this order:
   `https://www.expendesk.com/`, then `https://www.expendesk.com/about`, then
   `/pricing`, `/contact-us` and each `/solutions/*` page. `/about` is second on
   purpose — it is the page written to answer the brand query.
5. After a few days, check **Pages** for _"Duplicate, Google chose a different
   canonical"_ — that would mean the `vercel.app` copy is still winning, which
   should now be impossible.

### 2. Four footer links 404 on every page

`src/data/footer.json` links to `/legal/terms`, `/legal/privacy`,
`/legal/cookies` and `/legal/notice`. **None of these routes exist** — there is
no `src/app/legal/` directory, and all four return 404 in production (verified
2026-08-18).

That is four broken links in the footer of every single page: wasted crawl
budget on a domain that has very little, and a poor trust signal for a finance
product that handles company spend — exactly the category where a visitor looks
for a privacy policy before signing up.

These were left unbuilt deliberately: privacy and terms copy is a legal
document, and generated placeholder text published as a company's real policy is
worse than no page. **Either write the four pages, or remove the links from
`footer.json` until they exist.** Leaving them pointing at 404s is the one
option that helps nobody.

### 3. Fix the `NEXT_PUBLIC_SITE_URL` environment variable

On Vercel → Project → Settings → Environment Variables, the Production value was
`https://expendesk-v1.vercel.app/`.

**Either delete it, or set it to `https://www.expendesk.com`.**

The code ignores the bad value — production now serves the correct host, so this
is no longer urgent — but leaving a wrong value in the dashboard is a trap for
the next person. Redeploy after changing it (env changes don't apply to existing
builds).

### 4. Link Expendesk from elogixsoft.com — highest-value item on this list

[elogixsoft.com](https://www.elogixsoft.com/) does **not mention Expendesk
anywhere** (checked 2026-08-18). This is the cheapest significant win available,
and it needs no permission from anyone outside the company.

The site now claims Elogix as its `parentOrganization`. That claim is one-way:
Expendesk asserts it, and nothing on Elogix's side confirms it. A link and a
product mention on elogixsoft.com closes the loop from an established, indexed
domain — the exact corroboration a coined brand name needs, from a source Google
already trusts.

A product page or even a homepage mention linking to `https://www.expendesk.com/`
is worth more than any further metadata work in this repository.

### 5. Recommended, not required

- **Bing Webmaster Tools** — import the Search Console property; it also feeds
  ChatGPT and Copilot search results.
- **Google Business Profile** — a verified business listing is one of the
  strongest possible "this brand is real" signals for a new name.
- **Keep the `sameAs` profiles live and branded.** The Facebook / Instagram /
  LinkedIn / YouTube profiles in `src/data/footer.json` are emitted as the
  Organization's `sameAs`, and are now also rendered as visible links on
  `/about`. They are load-bearing corroboration — make sure each one exists, is
  public, and says "Expendesk". (All four resolved when last checked.)
- **Keep posting on LinkedIn, and link the site.** LinkedIn posts are currently
  the *only* results Google returns for "expendesk" — that channel is already
  working. Every post that links `expendesk.com` points that established
  authority at the domain that should be ranking.
- **Get listed off-site.** A Crunchbase entry for Expendesk (Elogix already has
  one), and G2 / Capterra / Software Suggest listings, are how a product name
  becomes an entity. These help more than further on-page work.

---

## Realistic timeline

The 2026-08-07 prediction that `"Showing results for spendesk"` would soften to
`"Did you mean: spendesk"` within 2–6 weeks landed in about ten days. That step
is done. The remaining distance is getting the site itself into the results.

| When | What to expect |
| --- | --- |
| ✅ Done | Correct sitemap, canonicals and entity data live; Google treats "expendesk" as a real word. |
| 1–7 days after **requesting indexing in Search Console** | `/` and `/about` start appearing for the exact query `expendesk`. |
| 2–6 weeks after that | The brand result stabilises above the LinkedIn posts; `/about` is the likely source for any AI-overview answer to "what is Expendesk". |
| 1–3 months | Inner pages rank; possible sitelinks under the brand result. |

**Every row after the first depends on step 1 in
[Actions still required](#actions-still-required).** The clock does not start
when this code deploys — it starts when Google is told the site exists. If
nothing changes 2–3 weeks after requesting indexing, the answer will be in
Search Console's **Pages** report, not in this repository.

Ranking for the **brand name** is achievable and is what these changes target.
Ranking page 1 for competitive generic terms like _"expense management
software"_ is a content-and-links problem, not a metadata problem — no
technical change can deliver that, and anyone promising otherwise is guessing.

---

## How to verify

### Locally

```bash
npm run build

# Correct host, no "//" anywhere
cat .next/server/app/robots.txt.body
cat .next/server/app/sitemap.xml.body | head -20

# Every indexable page should show a self-referencing canonical
grep -o '<link rel="canonical"[^>]*>' .next/server/app/index.html
grep -o '<link rel="canonical"[^>]*>' .next/server/app/pricing.html
grep -o '<link rel="canonical"[^>]*>' .next/server/app/about.html

# The brand page must state the brand in the H1 *without* JavaScript
grep -o '<h1[^>]*>.\{0,120\}' .next/server/app/about.html
```

Confirm preview builds de-index themselves:

```bash
VERCEL_ENV=preview npm run build
cat .next/server/app/robots.txt.body     # → "Disallow: /"
```

### Against production, after deploying

```bash
curl -s https://www.expendesk.com/robots.txt
curl -s https://www.expendesk.com/sitemap.xml | head -20
curl -s https://www.expendesk.com/ | grep -o '<link rel="canonical"[^>]*>'

# The duplicate must now refuse indexing
curl -sI https://expendesk-v1.vercel.app/ | grep -i x-robots-tag
```

### Automated output checks

```bash
npm run build
npm run verify:seo
```

Asserts the three invariants that have each been broken at least once here and
that are invisible in code review, because they are properties of the rendered
HTML rather than of any one source file:

1. every page's `og:url` equals its `rel=canonical`
2. every FAQPage question in the markup also appears in the visible HTML
3. every `ld+json` block parses, and no `SoftwareApplication` ships `offers`
   while the pricing data still says placeholder

Run it before any deploy that touches metadata.

### Structured data

Paste `https://www.expendesk.com/` and `https://www.expendesk.com/about` into:

- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

Expect on `/`: two `Organization` nodes (Expendesk and its parent Elogix),
`WebSite`, `SoftwareApplication` and `FAQPage`, with no errors. On `/about`:
the same site graph plus `AboutPage` and `BreadcrumbList`.

Every `@id` reference must resolve to a node in the same document — a dangling
`parentOrganization` pointer is silently ignored rather than reported as an
error, so check the graph is actually connected:

```bash
node -e "
  const html = require('fs').readFileSync('.next/server/app/about.html','utf8');
  for (const m of html.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g))
    JSON.parse(m[1]);      // throws if any block is malformed
  console.log('all ld+json blocks parse');
"
```

---

## Rules for future work

1. **Never build a URL with `` `${SITE_URL}${path}` ``.** Use `absoluteUrl()`.
   The string concatenation is what produced `//pricing` in the live sitemap.
2. **Every new indexable page needs `alternates.canonical`.** There is no
   site-wide default and there deliberately cannot be one — canonical is
   inherited by child routes, so setting it in a layout would point every page
   at that layout's URL.
3. **Add new indexable routes to `src/app/sitemap.ts`.** Blog posts are
   automatic; marketing pages are not.
4. **Don't put the brand in a page `title`** — the root layout's template
   appends `" — Expendesk"` already. `/about` is the one deliberate exception,
   and the reason is documented in the file.
5. **Never add `aggregateRating`, `review` or `offers` to the structured data
   unless the numbers are real.** Fabricated review markup is a manual-action
   risk, and the pricing figures in `_data/` are still placeholders.
6. **Every fact in `PARENT_ORGANIZATION` and on `/about` must be checkable
   against a public source.** The same claims appear in JSON-LD and in the
   rendered copy; Google cross-checks the two, and a mismatch gets the markup
   discounted rather than merely ignored. If you add a founding date, address,
   employee count or customer number, verify it first — see the header comment
   in `src/app/about/_data/content.ts`.
7. **Never mark up a price, rating, or media asset you have not verified.**
   Prices must match what the page shows and must not be placeholders; a
   `VideoObject` needs a `contentUrl` that actually resolves. `npm run
   verify:seo` catches the pricing case; the rest is on you.
8. **Build page metadata with `pageMetadata()`, not a bare object.** `openGraph`
   is replaced wholesale rather than merged, so a hand-written `alternates`
   block leaves `og:url` pointing at the home page.
9. **The home page `<title>` must contain Expendesk literally.**
   `title.template` does not apply to `app/page.tsx` — it is the root segment,
   not a child of it. Every other route gets the suffix automatically.
10. **Don't add a route to `footer.json` before the route exists.** The four
   `/legal/*` links have been 404ing sitewide since launch precisely because
   this happened once already.
