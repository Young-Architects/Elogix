import Link from 'next/link';

interface Props {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  basePath = '/resources/blogs',
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const items: (number | 'gap')[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push('gap');
    items.push(p);
  });

  return (
    <nav
      aria-label="Blog pages"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {currentPage > 1 && (
        <Link
          href={pageHref(basePath, currentPage - 1)}
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200"
        >
          Previous
        </Link>
      )}

      {items.map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(basePath, item)}
            aria-current={item === currentPage ? 'page' : undefined}
            className={
              item === currentPage
                ? 'rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(99,102,241,0.7)]'
                : 'rounded-full px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200'
            }
          >
            {item}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={pageHref(basePath, currentPage + 1)}
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
