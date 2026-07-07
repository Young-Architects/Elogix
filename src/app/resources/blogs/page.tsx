/**
 * /resources/blogs — blog listing page.
 *
 * Server Component: data fetched with ISR + cache tags, so posts published in
 * WordPress appear automatically (instantly via /api/revalidate webhook,
 * otherwise within the 5-minute revalidation window).
 *
 * Layout: gradient hero header → featured (newest) post on page 1 →
 * responsive card grid → pagination. `?category=` filters the grid using the
 * same cached post data.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog-api';
import type { BlogPost } from '@/types/blog';
import BlogCard from './_components/BlogCard';
import BlogPagination from './_components/BlogPagination';
import FeaturedPost from './_components/FeaturedPost';
import { listing } from './_data/content';

export const metadata: Metadata = {
  title: listing.metaTitle,
  description: listing.metaDescription,
};

const POSTS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

function StateCard({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-14 text-center ring-1 ring-slate-200/80">
      <h2 className="text-lg font-bold text-slate-900">{heading}</h2>
      <p className="mt-2 text-slate-600">{body}</p>
    </div>
  );
}

export default async function BlogsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const category = params.category?.trim();

  // Category view reuses the cached first-100 list and filters in-process —
  // the WP plugin has no category endpoint, and volumes here are small.
  const data = category
    ? await getBlogPosts(1, 100)
    : await getBlogPosts(page, POSTS_PER_PAGE);

  let posts: BlogPost[] = data?.posts ?? [];
  if (category && data) {
    posts = posts.filter((p) =>
      p.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    );
  }

  // Featured hero only on the unfiltered first page, when there's enough
  // content for the grid below to not feel empty.
  const showFeatured = !category && page === 1 && posts.length > 1;
  const featured = showFeatured ? posts[0] : null;
  const gridPosts = featured ? posts.slice(1) : posts;

  return (
    <main className="relative">
      {/* Hero header with soft brand wash */}
      <header className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-violet-50/40 to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-200/40 via-violet-200/40 to-fuchsia-200/40 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-16 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            {listing.eyebrow}
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {listing.heading}{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {listing.headingAccent}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {listing.intro}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* Active category filter bar */}
        {category && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-sm font-semibold text-white">
              {listing.categoryLabel}: {category}
            </span>
            <Link
              href="/resources/blogs"
              className="text-sm font-medium text-indigo-600 underline-offset-4 hover:underline"
            >
              {listing.clearFilter}
            </Link>
          </div>
        )}

        {!data ? (
          <StateCard
            heading={listing.errorState.heading}
            body={listing.errorState.body}
          />
        ) : posts.length === 0 ? (
          <StateCard
            heading={listing.emptyState.heading}
            body={listing.emptyState.body}
          />
        ) : (
          <>
            {featured && (
              <div className="mb-14">
                <FeaturedPost post={featured} />
              </div>
            )}

            {featured && gridPosts.length > 0 && (
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  {listing.latestLabel}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
              </div>
            )}

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {!category && (
              <BlogPagination
                currentPage={data.page}
                totalPages={data.total_pages}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
