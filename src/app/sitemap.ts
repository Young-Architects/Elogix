/**
 * sitemap.xml — static marketing routes plus every published blog post.
 * Blog entries come from the WordPress Blog-to-JSON API, so newly published
 * posts appear here automatically (same ISR caching as the blog pages).
 */

import type { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blog-api';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE_URL}/resources/blogs`,
      changeFrequency: 'daily',
      priority: 0.8,
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
        url: `${SITE_URL}/resources/blogs/${post.slug}`,
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
