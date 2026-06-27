import { Deal } from '@fractionax/domain';
import { headers } from 'next/headers';
import Link from 'next/link';
import { z } from 'zod';

import { ClassRail } from '@/components/class-rail';
import { DealsControls } from '@/components/deals-controls';
import { DealsPagination } from '@/components/deals-pagination';
import { DealsTable } from '@/components/deals-table';
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

async function fetchAllDeals(): Promise<{ deals: Deal[]; error: string | null }> {
  try {
    const res = await fetch(`${AGENTS_URL}/deals`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) return { deals: [], error: 'Couldn’t load deals right now. Try again in a moment.' };
    const parsed = Deals.safeParse(deepCamel(await res.json()));
    if (!parsed.success) return { deals: [], error: 'Couldn’t read the deals response. Try again.' };
    return { deals: parsed.data, error: null };
  } catch (e) {
    const waking = e instanceof Error && e.name === 'TimeoutError';
    return {
      deals: [],
      error: waking
        ? 'The agents are waking up — give it a few seconds, then try again.'
        : 'Couldn’t reach the agents. Check your connection and try again.',
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
  const { deals, error } = await fetchAllDeals();
  // Format currency in the visitor's locale (server render has no browser locale).
  const locale =
    (await headers()).get('accept-language')?.split(',')[0]?.split(';')[0]?.trim() || undefined;
  const { counts, total, page, pageCount, pageRows, totalAll } = selectDeals(deals, params);

  return (
    <main id="main" className="px-safe mx-auto max-w-6xl py-12">
      <PageHeader
        kicker="Discovery"
        title="Deal discovery"
        description="Browse sourced real-world-asset opportunities across nine classes — filter, sort, and open any deal."
      />

      {error ? (
        <div role="alert" className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-destructive">{error}</span>
          <RetryButton />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
          <aside className="hidden md:block">
            <div className="mb-2 px-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Classes
            </div>
            <ClassRail params={params} counts={counts} totalAll={totalAll} />
          </aside>

          <section className="min-w-0">
            <DealsControls params={params} />
            <p className="mt-3 font-mono text-xs tabular-nums text-muted-foreground" aria-live="polite">
              {total === 0 ? 'No matches' : `${total} ${total === 1 ? 'asset' : 'assets'}`}
              {params.class ? ` · ${classLabel(params.class)}` : ''}
            </p>

            {total === 0 ? (
              <EmptyState />
            ) : (
              <div className="mt-3 space-y-4">
                <DealsTable rows={pageRows} params={params} locale={locale} />
                <DealsPagination params={params} page={page} pageCount={pageCount} total={total} />
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
