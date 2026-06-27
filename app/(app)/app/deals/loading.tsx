import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

// Shown instantly while the deals server fetch runs (the agents service can
// cold-start on its free tier). Mirrors the loaded page exactly — same PageHeader
// and two-column grid — so there's no header jump or layout shift.
export default function DealsLoading() {
  return (
    <main id="main" className="px-safe mx-auto max-w-5xl py-12">
      <PageHeader
        kicker="Discovery"
        title="Deal discovery"
        description="Browse sourced alternative-asset opportunities — sorted by projected yield."
      />

      <div className="mt-6 flex flex-wrap gap-2" aria-hidden>
        {['all', 'low', 'medium', 'high'].map((k) => (
          <Skeleton key={k} className="h-9 w-20" />
        ))}
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-2" aria-busy="true" aria-label="Loading deals">
        {['a', 'b', 'c', 'd'].map((k) => (
          <Skeleton key={k} className="h-40" />
        ))}
      </div>
    </main>
  );
}
