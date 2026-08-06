/**
 * robots.txt
 *
 * The `Sitemap:` line is the single most important thing here — it is how a
 * crawler that arrives without any prior knowledge of the site discovers every
 * URL worth indexing. It previously pointed at
 * `https://expendesk-v1.vercel.app//sitemap.xml`: the wrong host, and a double
 * slash on top. Both came from `SITE_URL`, which is now normalised and pinned
 * to the canonical origin in `lib/site.ts`.
 *
 * Non-production deploys serve a fully disallowing robots.txt, so a preview
 * URL can't be crawled into the index as a duplicate of the live site.
 */
import type { MetadataRoute } from 'next';
import { SITE_URL, IS_INDEXABLE_DEPLOY, absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE_DEPLOY) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // `/api/` holds the chat and revalidation endpoints: no indexable
      // content, and crawling them just burns crawl budget.
      disallow: ['/api/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
