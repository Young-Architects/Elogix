import { ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import { post } from '../_data/content';

export default function BlogPostNotFound() {
  const copy = post.notFound;
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-6xl font-black text-transparent">
        {copy.eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        {copy.heading}
      </h1>
      <p className="mt-3 max-w-md text-slate-600">{copy.body}</p>
      <div className="mt-8">
        <MagneticButton
          href="/resources/blogs"
          size="lg"
          icon={<ArrowRight className="h-4 w-4" aria-hidden />}
          className="rounded-full"
        >
          {copy.cta}
        </MagneticButton>
      </div>
    </main>
  );
}
