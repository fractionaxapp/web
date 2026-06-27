import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the loaded deal detail — the same PageHeader shape (gold hairline +
// "Opportunity" kicker, with the dynamic title/meta/badge as skeletons) — so the
// header doesn't jump when the deal resolves.
export default function DealDetailLoading() {
  return (
    <main id="main" className="px-safe mx-auto max-w-5xl py-12" aria-busy="true" aria-label="Loading deal">
      <Skeleton className="h-5 w-20" />
      <div className="mt-6">
        <div aria-hidden className="mb-4 h-px w-8 bg-brand-gold" />
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="kicker text-primary">Opportunity</p>
            <Skeleton className="mt-2 h-9 w-2/3" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="mt-3 h-4 w-1/2" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="mt-8 h-10 w-40" />
    </main>
  );
}
