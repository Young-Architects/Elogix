/**
 * Server-side data layer for the Blog to JSON API.
 *
 * All functions run on the server (Server Components / route handlers).
 * Responses are cached with Next.js ISR and tagged so they can be purged
 * instantly by the /api/revalidate webhook when WordPress publishes a post.
 */

import type { BlogListResponse, BlogPost } from '@/types/blog';

const API_BASE = (
  process.env.WORDPRESS_API_URL ??
  'https://lightseagreen-chough-517020.hostingersite.com/wp-json/blog-to-json/v1'
).replace(/\/$/, '');

/** Fallback freshness window (seconds) if the webhook is not configured. */
const REVALIDATE_SECONDS = 300;

/** Cache tags used by /api/revalidate for instant purging. */
export const BLOG_CACHE_TAGS = {
  list: 'blog-list',
  post: (slug: string) => `blog-post-${slug}`,
};

/**
 * WordPress HTML-encodes titles/excerpts (&#8217;, [&hellip;], &amp; …).
 * The rest of the app treats them as plain text, so decode once here.
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  trade: '™',
  copy: '©',
  reg: '®',
  deg: '°',
  middot: '·',
  bull: '•',
};

export function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code =
        entity[1]?.toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      try {
        return String.fromCodePoint(code);
      } catch {
        return match;
      }
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function normalizePost(post: BlogPost): BlogPost {
  return {
    ...post,
    title: decodeHtmlEntities(post.title),
    excerpt: decodeHtmlEntities(post.excerpt),
  };
}

async function fetchJson<T>(path: string, tags: string[]): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags },
      headers: { Accept: 'application/json' },
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Blog API responded with ${res.status} for ${path}`);
    }
    return (await res.json()) as T;
  } catch (error) {
    // Never let a CMS hiccup take the whole site down — log and degrade.
    console.error('[blog-api]', path, error);
    return null;
  }
}

/** Paginated list of published posts (newest first). */
export async function getBlogPosts(
  page = 1,
  perPage = 9
): Promise<BlogListResponse | null> {
  const data = await fetchJson<BlogListResponse>(
    `/posts?page=${page}&per_page=${perPage}`,
    [BLOG_CACHE_TAGS.list]
  );
  if (!data || !Array.isArray(data.posts)) return data;
  return { ...data, posts: data.posts.map(normalizePost) };
}

/** Single post by slug — the canonical lookup for /resources/blogs/[slug]. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const safeSlug = encodeURIComponent(slug);
  const post = await fetchJson<BlogPost>(`/posts/slug/${safeSlug}`, [
    BLOG_CACHE_TAGS.post(slug),
    BLOG_CACHE_TAGS.list,
  ]);
  return post ? normalizePost(post) : null;
}

/** Single post by numeric ID (handy for previews/debugging). */
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const post = await fetchJson<BlogPost>(`/posts/${id}`, [BLOG_CACHE_TAGS.list]);
  return post ? normalizePost(post) : null;
}

/** All slugs, used by generateStaticParams to pre-render posts at build time. */
export async function getAllBlogSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const data = await getBlogPosts(page, 100);
    if (!data) break;
    slugs.push(...data.posts.map((p) => p.slug));
    totalPages = data.total_pages;
    page += 1;
  } while (page <= totalPages);

  return slugs;
}

/** Rough reading-time estimate from the parsed content blocks. */
export function estimateReadingTime(post: BlogPost): number {
  const words = post.content
    .map((block) => ('text' in block && block.text ? block.text : ''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * WordPress accounts are often registered with a bare email address — never
 * show that publicly. Falls back to the given brand byline instead.
 */
export function displayAuthorName(name: string, fallback: string): string {
  const trimmed = name?.trim() ?? '';
  if (!trimmed || trimmed.includes('@')) return fallback;
  return trimmed;
}

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
