/**
 * BlogCard — grid card for the /resources/blogs listing.
 * Image with category pill overlay, title, excerpt, meta row and a
 * "Read article" affordance, all inside one full-card link.
 */

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '@/types/blog';
import {
  displayAuthorName,
  estimateReadingTime,
  formatBlogDate,
} from '@/lib/blog-api';
import { post as postCopy } from '../_data/content';

export default function BlogCard({ post }: { post: BlogPost }) {
  const image = post.featured_image?.url;
  const author = displayAuthorName(post.author.name, postCopy.fallbackAuthor);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-18px_rgba(99,102,241,0.35)] hover:ring-indigo-200">
      <Link
        href={`/resources/blogs/${post.slug}`}
        className="flex h-full flex-col"
      >
        {/* Cover */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50">
          {image ? (
            <Image
              src={image}
              alt={post.featured_image?.alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="bg-gradient-to-br from-indigo-400 to-violet-500 bg-clip-text text-6xl font-black text-transparent opacity-40">
                {post.title.charAt(0)}
              </span>
            </div>
          )}

          {post.categories.length > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600 shadow-sm backdrop-blur">
              {post.categories[0]}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" aria-hidden />
              <time dateTime={post.date} className="whitespace-nowrap">
                {formatBlogDate(post.date)}
              </time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-400" aria-hidden />
              <span className="whitespace-nowrap">
                {estimateReadingTime(post)} {postCopy.readTimeSuffix}
              </span>
            </span>
          </div>

          <h2 className="break-words text-lg font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
              {post.excerpt}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white">
                {author.charAt(0)}
              </span>
              {author}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
              Read article
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
