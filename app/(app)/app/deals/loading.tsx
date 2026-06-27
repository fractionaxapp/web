import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

const RAIL = ['all', 're', 'pc', 'inv', 'ip', 'rs', 'tf', 'infra', 'carbon', 'col'];
const ROWS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// Mirrors the loaded deals page exactly — same PageHeader, class rail, and table
// shape — so there's no header or layout jump while the agents fetch resolves.
export default function DealsLoading() {
  return (
    <main id="main" className="px-safe mx-auto max-w-6xl py-12">
      <PageHeader
        kicker="Discovery"
        title="Deal discovery"
        description="Browse sourced real-world-asset opportunities across nine classes — filter, sort, and open any deal."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="hidden md:block" aria-hidden>
          <div className="mb-2 px-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Classes
          </div>
          <div className="flex flex-col gap-1">
            {RAIL.map((k) => (
              <Skeleton key={k} className="h-11" />
            ))}
          </div>
        </aside>

        <section className="min-w-0 space-y-4" aria-busy="true" aria-label="Loading deals">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-10 min-w-40 flex-1" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-[4.5rem] w-full" />
          <Skeleton className="h-4 w-24" />
          <div className="border">
            <Skeleton className="h-10 border-b" />
            {ROWS.map((k) => (
              <Skeleton key={k} className="h-12 border-b last:border-0" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
