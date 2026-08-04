/** Canonical origin for absolute URLs (OG images, canonicals, sitemap).
 *  Set NEXT_PUBLIC_SITE_URL to the production domain when deploying. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Google Tag Manager container ID, injected in the root layout.
 *
 *  The ID is public by design — it ends up in the page source either way — so
 *  it is safe to keep here rather than in a secret. Set NEXT_PUBLIC_GTM_ID to
 *  an empty string on a preview/staging deploy (or in .env.local) to switch GTM
 *  off completely there and keep that traffic out of your analytics. */
export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-5HQ9QMX7';
