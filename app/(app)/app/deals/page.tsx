import { Deal } from '@fractionax/domain';
import { headers } from 'next/headers';
import Link from 'next/link';
import { z } from 'zod';

import { AgentsWarming } from '@/components/agents-warming';
import { ClassRail } from '@/components/class-rail';
import { DealCard } from '@/components/deal-card';
import { DealsControls } from '@/components/deals-controls';
import { DealsFilterChips } from '@/components/deals-filter-chips';
import { DealsPagination } from '@/components/deals-pagination';
import { DealsSummary } from '@/components/deals-summary';
import { DealsTable } from '@/components/deals-table';
import { DealsViewToggle } from '@/components/deals-view-toggle';
import { PageHeader } from '@/components/page-header';
import { RetryButton } from '@/components/retry-button';
import { buttonVariants } from '@/components/ui/button';
import { classLabel } from '@/lib/asset-classes';
import { deepCamel } from '@/lib/case';
import { parseParams, selectDeals, type DealsParams } from '@/lib/deals-query';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Deal discovery' };

// Fetch deals live from the agents service per request (not at build time).
export const dynamic = 'force-dynamic';
// The agents service runs on a free tier that sleeps when idle. Allow headroom
// for a cold start, but fail gracefully (never a gateway 504) if it's too slow.
export const maxDuration = 30;

const Deals = z.array(Deal);
const AGENTS_URL = process.env.AGENTS_URL ?? 'http://localhost:8000';

async function fetchAllDeals(): Promise<{ deals: Deal[]; error: string | null; waking: boolean }> {
  try {
    // Short timeout: a warm service answers in <1s, so a stall means a cold
    // start — surface the auto-retrying "warming" state quickly rather than hang.
    const res = await fetch(`${AGENTS_URL}/deals`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok)
      return { deals: [], error: 'Couldn’t load deals right now. Try again in a moment.', waking: false };
    const parsed = Deals.safeParse(deepCamel(await res.json()));
    if (!parsed.success)
      return { deals: [], error: 'Couldn’t read the deals response. Try again.', waking: false };
    return { deals: parsed.data, error: null, waking: false };
  } catch (e) {
    const waking = e instanceof Error && e.name === 'TimeoutError';
    return {
      deals: [],
      error: waking
        ? 'The agents are waking up — give it a few seconds, then try again.'
        : 'Couldn’t reach the agents. Check your connection and try again.',
      waking,
    };
  }
}

function EmptyState() {
  return (
    <div className="mt-3 flex flex-col items-center gap-3 border border-dashed p-12 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">No matches</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        No assets fit these filters. Try another class, or clear the filters to see everything.
      </p>
      <Link href="/app/deals" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}>
        Clear filters
      </Link>
    </div>
  );
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params: DealsParams = parseParams(await searchParams);
  const { deals, error, waking } = await fetchAllDeals();
  // Format currency in the visitor's locale (server render has no browser locale).
  const locale =
    (await headers()).get('accept-language')?.split(',')[0]?.split(';')[0]?.trim() || undefined;
  const { counts, total, page, pageCount, pageRows, totalAll, summary } = selectDeals(deals, params);

  return (
    <main id="main" className="px-safe mx-auto max-w-6xl py-12">
      <PageHeader
        kicker="Discovery"
        title="Deal discovery"
        description="Browse sourced real-world-asset opportunities across nine classes — filter, sort, and open any deal."
      />

      {error ? (
        waking ? (
          <AgentsWarming />
        ) : (
          <div role="alert" className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-destructive">{error}</span>
            <RetryButton />
          </div>
        )
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
          <aside className="hidden md:block">
            <div className="mb-2 px-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Classes
            </div>
            <ClassRail params={params} counts={counts} totalAll={totalAll} />
          </aside>

          <section className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 w-full sm:flex-1">
                <DealsControls params={params} />
              </div>
              {/* The view toggle is desktop-only; phones always get cards. */}
              <div className="hidden sm:block">
                <DealsViewToggle params={params} />
              </div>
            </div>

            <DealsFilterChips params={params} />
            <DealsSummary summary={summary} locale={locale} />

            <p className="font-mono text-xs tabular-nums text-muted-foreground" aria-live="polite">
              {total === 0 ? 'No matches' : `${total} ${total === 1 ? 'asset' : 'assets'}`}
              {params.class ? ` · ${classLabel(params.class)}` : ''}
            </p>

            {total === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {/* Phones: always cards — they stack every field, where the wide
                    multi-column table can't fit. Desktop honors the chosen view. */}
                <div className="grid gap-3 sm:hidden">
                  {pageRows.map((d) => (
                    <DealCard key={d.id} deal={d} locale={locale} />
                  ))}
                </div>
                <div className="hidden sm:block">
                  {params.view === 'cards' ? (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {pageRows.map((d) => (
                        <DealCard key={d.id} deal={d} locale={locale} />
                      ))}
                    </div>
                  ) : (
                    <DealsTable rows={pageRows} params={params} locale={locale} />
                  )}
                </div>
                <DealsPagination params={params} page={page} pageCount={pageCount} total={total} />
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
