/**
 * BlogSidebar — the sticky right rail on blog post pages:
 *  1. Brand CTA card (Book a Demo) — the blog's conversion surface.
 *  2. Recent Posts — latest articles excluding the one being read.
 *  3. Categories — aggregated from published posts, linking to the
 *     filtered listing (/resources/blogs?category=…).
 *
 * Server Component: receives already-fetched posts so the page controls
 * caching; renders nothing it doesn't have data for.
 */

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/types/blog';
import MagneticButton from '@/components/ui/MagneticButton';
import { formatBlogDate } from '@/lib/blog-api';
import { sidebar } from '../_data/content';

interface Props {
  /** Recent posts to feature (already excludes the current article). */
  recentPosts: BlogPost[];
  /** Category name → number of posts. */
  categories: Map<string, number>;
}

function CtaCard() {
  const { cta } = sidebar;
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-7 text-white shadow-[0_20px_50px_-20px_rgba(99,102,241,0.7)]">
      {/* soft glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-2xl"
      />

      <h3 className="relative text-xl font-bold leading-snug">{cta.heading}</h3>
      <p className="relative mt-3 text-sm leading-relaxed text-indigo-100">
        {cta.body}
      </p>

      {/* Ghost variant = no gradient layers, so the white pill survives;
          the magnetic pull, scale spring and shimmer still apply. */}
      <div className="relative mt-6">
        <MagneticButton
          href={cta.buttonHref}
          variant="ghost"
          fullWidth
          icon={<ArrowRight className="h-4 w-4" aria-hidden />}
          className="rounded-full bg-white px-5 py-3 text-sm font-bold text-indigo-700! shadow-lg focus-visible:ring-white/70 focus-visible:ring-offset-0"
        >
          {cta.button}
        </MagneticButton>
      </div>

      <Link
        href={cta.secondaryHref}
        className="relative mt-3 inline-flex w-full items-center justify-center text-sm font-medium text-indigo-100 underline-offset-4 hover:text-white hover:underline"
      >
        {cta.secondary}
      </Link>
    </div>
  );
}

function RecentPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
      <h3 className="text-lg font-bold text-slate-900">
        {sidebar.recentHeading}
      </h3>
      <div className="mt-5 space-y-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/resources/blogs/${post.slug}`}
            className="group flex gap-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 ring-1 ring-slate-100">
              {post.featured_image?.url ? (
                <Image
                  src={post.featured_image.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-xl font-black text-indigo-200">
                  {post.title.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3 w-3 text-indigo-400" aria-hidden />
                <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-indigo-600">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Categories({ categories }: { categories: Map<string, number> }) {
  if (categories.size === 0) return null;
  return (
    <div className="rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
      <h3 className="text-lg font-bold text-slate-900">
        {sidebar.categoriesHeading}
      </h3>
      <ul className="mt-4 divide-y divide-slate-100">
        {[...categories.entries()].map(([name, count]) => (
          <li key={name}>
            <Link
              href={`/resources/blogs?category=${encodeURIComponent(name)}`}
              className="group flex items-center justify-between py-2.5 text-sm text-slate-700 transition-colors hover:text-indigo-600"
            >
              <span className="flex items-center gap-2">
                <ChevronRight
                  className="h-4 w-4 text-indigo-400 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
                <span className="font-medium">{name}</span>
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                {count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BlogSidebar({ recentPosts, categories }: Props) {
  return (
    <div className="space-y-6 lg:sticky lg:top-28">
      <CtaCard />
      <RecentPosts posts={recentPosts} />
      <Categories categories={categories} />
    </div>
  );
}
