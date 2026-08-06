/**
 * Single source of truth for the site's identity: its canonical origin, its
 * brand names, and the third-party IDs that get injected into every page.
 *
 * ── Why the origin is hardcoded rather than read straight from an env var ──
 *
 * Every canonical URL, every sitemap entry, every OpenGraph image URL and the
 * `Sitemap:` line in robots.txt is built from `SITE_URL`. If that value is
 * wrong, Google is told the site lives somewhere it doesn't — and the real
 * domain never ranks for its own brand name.
 *
 * That is exactly what happened here: `NEXT_PUBLIC_SITE_URL` was set on the
 * host to `https://expendesk-v1.vercel.app/`, so the live site was publishing
 * a sitemap full of `expendesk-v1.vercel.app//pricing` URLs (wrong host, plus
 * a double slash from the trailing-slash concatenation) while the actual
 * domain shipped no canonical tags at all.
 *
 * The brand's canonical origin is not a per-deploy value — it is a constant.
 * So it lives in code, where it is reviewed and versioned, and the env var is
 * demoted to an override that only applies when it names a *plausible*
 * canonical host. A preview URL can never silently become the canonical
 * origin again.
 */
import footerData from '@/data/footer.json';

/**
 * The one true public origin. `www` (not the apex) because
 * `https://expendesk.com` issues a 308 redirect to `https://www.expendesk.com`
 * — the canonical URL must be the destination of that redirect, never the
 * source, or every canonical tag points at a redirect hop.
 *
 * No trailing slash: everything downstream concatenates `${SITE_URL}/path`.
 */
const PRODUCTION_ORIGIN = 'https://www.expendesk.com';

/**
 * Hosts that must never be treated as the canonical origin, even if an env
 * var names one. These are platform-assigned deploy URLs: they serve a
 * byte-identical copy of the site, so letting one become canonical splits the
 * site's ranking signals across two domains.
 */
const NON_CANONICAL_HOST_PATTERN = /(^|\.)(vercel\.app|netlify\.app|pages\.dev|onrender\.com)$/i;

/**
 * Reduce an arbitrary string to a bare `scheme://host[:port]` origin, or
 * `null` if it isn't a usable absolute http(s) URL.
 *
 * Using the URL parser rather than string surgery is what strips the trailing
 * slash, any stray path, and any whitespace in one step — `new URL(...).origin`
 * is trailing-slash-free by definition.
 */
function normalizeOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * Resolve the origin, in priority order:
 *
 *  1. `NEXT_PUBLIC_SITE_URL`, but only if it parses AND isn't a platform
 *     deploy host. This keeps the escape hatch for a genuine domain change
 *     while making the failure mode that broke indexing impossible.
 *  2. In dev, `http://localhost:3000`, so local links and OG previews resolve.
 *  3. The hardcoded production origin.
 */
function resolveSiteUrl(): string {
  const fromEnv = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  if (fromEnv) {
    const { hostname } = new URL(fromEnv);
    const isPlatformDeployHost = NON_CANONICAL_HOST_PATTERN.test(hostname);
    const isLoopback = hostname === 'localhost' || hostname === '127.0.0.1';

    // A loopback origin is correct locally and catastrophic in production, so
    // it is honoured only outside a production build.
    if (!isPlatformDeployHost && (!isLoopback || process.env.NODE_ENV !== 'production')) {
      return fromEnv;
    }
  }

  if (process.env.NODE_ENV !== 'production') return 'http://localhost:3000';

  return PRODUCTION_ORIGIN;
}

/** Canonical origin for absolute URLs (canonicals, OG images, sitemap, robots).
 *  Guaranteed to have no trailing slash and no path. */
export const SITE_URL = resolveSiteUrl();

/**
 * Build an absolute URL from a site-relative path.
 *
 * Every caller previously wrote `` `${SITE_URL}${path}` ``, which produced the
 * `//pricing` double slashes in the live sitemap the moment `SITE_URL` gained
 * a trailing slash. Routing all joins through here makes that class of bug
 * unrepresentable regardless of how either side is written.
 */
export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}/${path.replace(/^\/+/, '')}`;
}

/** Brand name, used in metadata, JSON-LD and title templates. */
export const SITE_NAME = 'Expendesk';

/**
 * Whether this deploy should be indexable.
 *
 * Vercel sets `VERCEL_ENV` to `production` | `preview` | `development`.
 * Preview builds serve a full copy of the site on a `*.vercel.app` URL; if
 * Google crawls one, it competes with the real domain for the same content.
 * Anything that isn't the production deploy gets a site-wide `noindex`.
 *
 * When `VERCEL_ENV` is absent (self-hosted, or `next start` locally) this
 * falls back to `NODE_ENV`, so a normal production build stays indexable.
 */
export const IS_INDEXABLE_DEPLOY = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.NODE_ENV === 'production';

/**
 * Google Search Console verification token (the value of the
 * `google-site-verification` meta tag).
 *
 * Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the token Search Console
 * gives you under "HTML tag" verification. Left unset, no tag is emitted —
 * an empty verification tag is worse than none, as it fails verification.
 */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '';

/**
 * Official brand profiles, emitted as `sameAs` in the Organization JSON-LD.
 *
 * This is load-bearing for the "did you mean Spendesk?" problem: `sameAs`
 * links are how Google corroborates that a little-known brand name is a real
 * entity with an independent presence, rather than a misspelling of a bigger
 * one.
 *
 * Read from `footer.json` rather than re-listed here so there is exactly one
 * place to add a profile, and so the structured data can never drift out of
 * sync with the links the site actually renders — a `sameAs` pointing at a
 * profile the company doesn't own is a bad signal, not a neutral one.
 */
export const SOCIAL_PROFILES: string[] = footerData.socials
  .map((s) => s.href)
  .filter((href) => href.startsWith('https://'));

/** Public contact address, surfaced in the Organization JSON-LD. */
export const CONTACT_EMAIL = 'info@expendesk.com';

/** Google Tag Manager container ID, injected in the root layout.
 *
 *  The ID is public by design — it ends up in the page source either way — so
 *  it is safe to keep here rather than in a secret. Set NEXT_PUBLIC_GTM_ID to
 *  an empty string on a preview/staging deploy (or in .env.local) to switch GTM
 *  off completely there and keep that traffic out of your analytics. */
export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-5HQ9QMX7';
