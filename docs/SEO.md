# SEO — why the site wasn't ranking, and how it's wired now

_Last updated: 2026-08-07_

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

## Actions still required

The code is deployed-ready, but **indexing will not fix itself**. These two
steps are the difference between "correct" and "ranking", and neither can be
done from the repository.

### 1. Fix the `NEXT_PUBLIC_SITE_URL` environment variable — do this first

On Vercel → Project → Settings → Environment Variables, the Production value is
currently `https://expendesk-v1.vercel.app/`.

**Either delete it, or set it to `https://www.expendesk.com`.**

The new code ignores the bad value, so the site is correct either way — but
leaving a wrong value in the dashboard is a trap for the next person. Redeploy
after changing it (env changes don't apply to existing builds).

### 2. Google Search Console — this is what actually gets you indexed

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
   and add a **Domain property** for `expendesk.com` (a domain property covers
   `www`, apex, http and https in one; a URL-prefix property does not).
2. Verify via DNS TXT record — add it wherever `expendesk.com`'s DNS is managed.
   - If you'd rather verify with the HTML tag, set
     `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the token and redeploy; the
     layout emits the tag automatically.
3. **Sitemaps** → submit `https://www.expendesk.com/sitemap.xml`.
4. **URL Inspection** → paste `https://www.expendesk.com/` → **Request
   Indexing**. Repeat for `/pricing`, `/contact-us`, and each `/solutions/*`
   page. This is the fastest route into the index for a new domain.
5. Check **Pages** after a few days for anything reported as
   _"Duplicate, Google chose a different canonical"_ — that would mean the
   `vercel.app` copy is still winning, which should now be impossible.

### 3. Recommended, not required

- **Bing Webmaster Tools** — import the Search Console property; it also feeds
  ChatGPT and Copilot search results.
- **Google Business Profile** — a verified business listing is one of the
  strongest possible "this brand is real" signals for a new name.
- **Keep the `sameAs` profiles live and branded.** The Facebook / Instagram /
  LinkedIn / YouTube profiles in `src/data/footer.json` are emitted as the
  Organization's `sameAs`. They are load-bearing corroboration for the brand
  name — make sure each one exists, is public, and says "Expendesk".
- **Get mentioned off-site.** Entity recognition for a brand-new coined word
  comes mostly from other domains using it. A Crunchbase / LinkedIn company
  page, a G2 or Capterra listing, and any press mention all help more than
  further on-page work.

---

## Realistic timeline

| When | What to expect |
| --- | --- |
| Immediately after deploy | Correct sitemap, canonicals and entity data are live. |
| 1–7 days after requesting indexing | Home page starts appearing for the exact query `expendesk`. |
| 2–6 weeks | `"Showing results for spendesk"` becomes `"Did you mean: spendesk"` — i.e. Google now treats "expendesk" as a real word and shows your results first. |
| 1–3 months | Inner pages rank; possible sitelinks under the brand result. |

Ranking for the **brand name** is achievable and is what this change targets.
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

Paste `https://www.expendesk.com/` into:

- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

Expect `Organization`, `WebSite`, `SoftwareApplication` and `FAQPage` with no
errors.

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
   appends `" — Expendesk"` already.
5. **Never add `aggregateRating`, `review` or `offers` to the structured data
   unless the numbers are real.** Fabricated review markup is a manual-action
   risk, and the pricing figures in `_data/` are still placeholders.
