/** Skeleton matching the blog listing layout (hero header + featured + grid). */
export default function BlogsLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      {/* Hero header */}
      <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center">
        <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-11 w-4/5 animate-pulse rounded-2xl bg-slate-200" />
        <div className="mt-4 h-5 w-3/5 animate-pulse rounded-full bg-slate-100" />
      </div>

      {/* Featured card */}
      <div className="mb-14 grid overflow-hidden rounded-[2rem] ring-1 ring-slate-200/80 md:grid-cols-2">
        <div className="aspect-[16/10] animate-pulse bg-slate-200 md:aspect-auto md:min-h-[340px]" />
        <div className="space-y-4 p-8 sm:p-10">
          <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-8 w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="h-8 w-2/3 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
          <div className="h-10 w-36 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>

      {/* Card grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl ring-1 ring-slate-200/80"
          >
            <div className="aspect-[16/9] animate-pulse bg-slate-200" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
              <div className="h-5 w-full animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
