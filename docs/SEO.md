# SEO — why the site wasn't ranking, and how it's wired now

_Last updated: 2026-08-18_

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
7. **Don't add a route to `footer.json` before the route exists.** The four
   `/legal/*` links have been 404ing sitewide since launch precisely because
   this happened once already.
