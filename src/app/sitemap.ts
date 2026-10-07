/**
 * sitemap.xml — static marketing routes plus every published blog post.
 * Blog entries come from the WordPress Blog-to-JSON API, so newly published
 * posts appear here automatically (same ISR caching as the blog pages).
 */

import type { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blog-api';
import { absoluteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Every URL goes through `absoluteUrl` rather than `${SITE_URL}${path}`.
  // The old concatenation emitted `https://…//pricing` the moment SITE_URL
  // carried a trailing slash, which is how the live sitemap ended up listing
  // double-slashed URLs on the wrong host.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // The brand entity page. Priority sits just under the home page because for
    // the query that matters most here — the bare brand name — it is the page
    // most likely to satisfy the search, and the one whose indexing should be
    // requested first after the home page.
    {
      url: absoluteUrl('/about'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/resources/blogs'),
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/pricing'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Funnel entry. The thank-you page that follows it is deliberately absent:
    // it is noindex, and listing a noindex URL in a sitemap is a contradiction
    // Search Console reports as an error.
    {
      url: absoluteUrl('/book-a-demo'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/contact-us'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/contact-sales'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Industry landing pages (the /solutions hub itself is noindex'd until built)
    {
      url: absoluteUrl('/solutions/pharmaceutical'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/solutions/manufacturing'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/solutions/digital-agencies'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Legal pages. Indexable but low priority: they are trust signals a real
    // business is expected to have, not pages anyone searches for. All six are
    // linked from the footer on every page.
    {
      url: absoluteUrl('/legal/terms'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/legal/privacy'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/legal/cookies'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/legal/acceptable-use'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/legal/disclaimer'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/legal/copyright'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Walk every page of posts; on API failure we still emit the static routes.
  const blogRoutes: MetadataRoute.Sitemap = [];
  let page = 1;
  let totalPages = 1;
  do {
    const data = await getBlogPosts(page, 100);
    if (!data) break;
    for (const post of data.posts) {
      blogRoutes.push({
        url: absoluteUrl(`/resources/blogs/${post.slug}`),
        lastModified: new Date(post.modified),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
    totalPages = data.total_pages;
    page += 1;
  } while (page <= totalPages);

  return [...staticRoutes, ...blogRoutes];
}
