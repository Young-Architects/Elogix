/** Canonical origin for absolute URLs (OG images, canonicals, sitemap).
 *  Set NEXT_PUBLIC_SITE_URL to the production domain when deploying. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
