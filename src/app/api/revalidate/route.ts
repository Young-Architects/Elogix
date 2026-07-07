/**
 * POST /api/revalidate — on-demand ISR revalidation webhook.
 *
 * WordPress calls this (see wordpress/blog-to-json-webhook.php) whenever a
 * post is published, updated, or deleted, so the site reflects CMS changes
 * instantly instead of waiting for the time-based revalidation window.
 *
 * Request:  POST /api/revalidate
 *           Header: x-revalidate-secret: <REVALIDATE_SECRET>
 *           Body:   { "slug": "my-post-slug" }   (slug optional)
 */

import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { BLOG_CACHE_TAGS } from '@/lib/blog-api';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, error: 'REVALIDATE_SECRET is not configured.' },
      { status: 500 }
    );
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, error: 'Invalid secret.' },
      { status: 401 }
    );
  }

  let slug: string | undefined;
  try {
    const body = (await request.json()) as { slug?: string };
    slug = body.slug;
  } catch {
    // Empty body is fine — we'll just revalidate the list.
  }

  // 'max' = stale-while-revalidate (the single-argument form is deprecated
  // in Next 16): visitors keep getting a fast cached page while the fresh
  // version is fetched in the background.
  revalidateTag(BLOG_CACHE_TAGS.list, 'max');
  if (slug) {
    revalidateTag(BLOG_CACHE_TAGS.post(slug), 'max');
  }

  return NextResponse.json({
    revalidated: true,
    tags: [BLOG_CACHE_TAGS.list, ...(slug ? [BLOG_CACHE_TAGS.post(slug)] : [])],
    now: Date.now(),
  });
}
