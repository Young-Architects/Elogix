/**
 * /resources/blogs/[slug] — individual blog post page.
 *
 * Pre-rendered at build time for existing posts (generateStaticParams) and
 * rendered on demand for posts published afterwards (dynamicParams), so any
 * new blog uploaded in WordPress gets a page automatically.
 *
 * Layout: article column + sticky right sidebar (CTA card, recent posts,
 * categories — see BlogSidebar), with a tags + share row under the article.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import {
  getAllBlogSlugs,
  getBlogPosts,
  getBlogPostBySlug,
  displayAuthorName,
  estimateReadingTime,
  formatBlogDate,
} from '@/lib/blog-api';
import { SITE_URL } from '@/lib/site';
import BlogContent from '../_components/BlogContent';
import BlogSidebar from '../_components/BlogSidebar';
import ShareLinks from '../_components/ShareLinks';
import { post as postCopy } from '../_data/content';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Pre-render every published post at build time. */
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Posts published after the last build are rendered on first request. */
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Post not found' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/resources/blogs/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.name],
      tags: post.tags,
      images: post.featured_image?.url
        ? [{ url: post.featured_image.url, alt: post.featured_image.alt }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Post + sidebar data share the same tagged cache, so the webhook keeps
  // both fresh. The sidebar list also feeds recent posts and category counts.
  const [post, listData] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(1, 100),
  ]);
  if (!post) notFound();

  const allPosts = listData?.posts ?? [];
  const recentPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 4);
  const categories = new Map<string, number>();
  for (const p of allPosts) {
    for (const c of p.categories) {
      categories.set(c, (categories.get(c) ?? 0) + 1);
    }
  }

  const author = displayAuthorName(post.author.name, postCopy.fallbackAuthor);
  const readingTime = estimateReadingTime(post);
  const postUrl = `${SITE_URL}/resources/blogs/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.modified,
    author: { '@type': 'Person', name: author },
    image: post.featured_image?.url || undefined,
    keywords: post.tags.join(', ') || undefined,
    mainEntityOfPage: postUrl,
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // Safe: jsonLd is built exclusively from serializable API fields above.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <nav className="mb-10">
        <Link
          href="/resources/blogs"
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {postCopy.backLink}
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        {/* ── Article column ── */}
        <article className="min-w-0">
          <header className="mb-10">
            {post.categories.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Link
                    key={category}
                    href={`/resources/blogs?category=${encodeURIComponent(category)}`}
                    className="rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-100 transition-colors hover:bg-indigo-100"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
              {post.title}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-slate-100 py-4 text-sm text-slate-500">
              <span className="flex items-center gap-2.5 font-semibold text-slate-800">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(99,102,241,0.6)]">
                  {author.charAt(0)}
                </span>
                {author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-400" aria-hidden />
                <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-400" aria-hidden />
                {readingTime} {postCopy.readTimeSuffix}
              </span>
              {post.modified !== post.date && (
                <span className="text-slate-400">
                  {postCopy.updatedPrefix} {formatBlogDate(post.modified)}
                </span>
              )}
            </div>
          </header>

          {post.featured_image?.url && (
            <figure className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.3)]">
              <Image
                src={post.featured_image.url}
                alt={post.featured_image.alt || post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </figure>
          )}

          <BlogContent content={post.content} />

          {/* Tags + share */}
          <footer className="mt-14 rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200/70 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">
                  {postCopy.tagsLabel}
                </span>
                {post.tags.length > 0 ? (
                  post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  post.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                    >
                      {category}
                    </span>
                  ))
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-500">
                  {postCopy.shareLabel}
                </span>
                <ShareLinks url={postUrl} title={post.title} />
              </div>
            </div>
          </footer>
        </article>

        {/* ── Sidebar ── */}
        <aside className="mt-14 lg:mt-0">
          <BlogSidebar recentPosts={recentPosts} categories={categories} />
        </aside>
      </div>
    </main>
  );
}
