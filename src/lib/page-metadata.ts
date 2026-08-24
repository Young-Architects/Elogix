/**
 * Builder for per-route `metadata`, so a page's canonical URL and its
 * `og:url` cannot drift apart.
 *
 * ── The bug this exists to prevent ──
 *
 * `openGraph` is one of the few metadata fields Next replaces *wholesale*
 * rather than merging key-by-key. The root layout declares
 * `openGraph.url = SITE_URL/`, so every page that set `alternates.canonical`
 * but did not redeclare the entire `openGraph` object inherited the home
 * page's URL. `/pricing` shipped:
 *
 *     <link rel="canonical" href="https://www.expendesk.com/pricing"/>
 *     <meta property="og:url" content="https://www.expendesk.com"/>
 *
 * Two different answers to "what URL is this page?" on the same page. Crawlers
 * and social scrapers use `og:url` as a canonical hint, so this actively worked
 * against the consolidation the canonical tags were added to achieve.
 *
 * Passing `path` once and deriving both values from it makes the mismatch
 * unrepresentable — which is the only reliable fix for a bug whose failure mode
 * is silent and invisible in code review.
 *
 * ── What this deliberately does NOT set ──
 *
 * No `openGraph.images` / `twitter.images`. Next injects those automatically
 * from `opengraph-image.tsx` and `twitter-image.tsx`, complete with
 * `og:image:width`, `height`, `type` and `alt`. Hardcoding an image path here
 * would both duplicate those tags and point at a file that does not exist.
 */
import type { Metadata } from 'next';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

export interface PageMetadataInput {
  /** Site-relative path, e.g. `/pricing`. Use `/` for the home page. */
  path: string;
  /**
   * Page title WITHOUT the brand suffix — the root layout's
   * `template: "%s — Expendesk"` appends it. Omit entirely on the home page to
   * fall through to the layout's `title.default`.
   */
  title?: string;
  /** Meta description. Also reused as the OpenGraph/Twitter description. */
  description: string;
  /**
   * OpenGraph/Twitter title, when the social title should differ from the
   * `<title>` tag. Defaults to `title`.
   */
  socialTitle?: string;
}

export function pageMetadata({
  path,
  title,
  description,
  socialTitle,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogTitle = socialTitle ?? title;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      ...(ogTitle ? { title: ogTitle } : {}),
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      ...(ogTitle ? { title: ogTitle } : {}),
      description,
    },
  };
}
