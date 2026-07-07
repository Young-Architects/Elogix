/**
 * FeaturedPost — large split hero card for the newest article, shown at the
 * top of page 1 of the blog listing.
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
import { listing, post as postCopy } from '../_data/content';

export default function FeaturedPost({ post }: { post: BlogPost }) {
  const image = post.featured_image?.url;
  const author = displayAuthorName(post.author.name, postCopy.fallbackAuthor);

  return (
    <article className="group relative overflow-hidden rounded-[2rem] bg-white ring-1 ring-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.05)] transition-shadow duration-300 hover:shadow-[0_28px_60px_-20px_rgba(99,102,241,0.35)]">
      <Link
        href={`/resources/blogs/${post.slug}`}
        className="grid md:grid-cols-2"
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 md:aspect-auto md:min-h-[340px]">
          {image ? (
            <Image
              src={image}
              alt={post.featured_image?.alt || post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full min-h-[240px] items-center justify-center">
              <span className="bg-gradient-to-br from-indigo-400 to-violet-500 bg-clip-text text-8xl font-black text-transparent opacity-40">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              {listing.featuredLabel}
            </span>
            {post.categories.slice(0, 1).map((category) => (
              <span
                key={category}
                className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600"
              >
                {category}
              </span>
            ))}
          </div>

          <h2 className="break-words text-2xl font-extrabold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-3xl">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="line-clamp-3 leading-relaxed text-slate-600">
              {post.excerpt}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
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
              {estimateReadingTime(post)} {postCopy.readTimeSuffix}
            </span>
          </div>

          <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-indigo-600 group-hover:shadow-[0_10px_25px_-8px_rgba(99,102,241,0.6)]">
            Read article
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
