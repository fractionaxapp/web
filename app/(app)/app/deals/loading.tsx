import { Skeleton } from '@/components/ui/skeleton';

// Shown instantly while the deals server fetch runs (the agents service can
// cold-start on its free tier). Mirrors the page shape so there's no layout shift.
export default function DealsLoading() {
  return (
    <main id="main" className="px-safe mx-auto max-w-5xl py-12">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Deal discovery</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Browse sourced alternative-asset opportunities — sorted by projected yield.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" aria-hidden>
        {['all', 'low', 'medium', 'high'].map((k) => (
          <Skeleton key={k} className="h-9 w-20 rounded-md" />
        ))}
      </div>

      <div className="mt-6 grid gap-3" aria-busy="true" aria-label="Loading deals">
        {['a', 'b', 'c', 'd'].map((k) => (
          <Skeleton key={k} className="h-40 rounded-xl" />
        ))}
      </div>
    </main>
  );
}
