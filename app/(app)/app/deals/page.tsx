import { Deal } from '@fractionax/domain';
import { headers } from 'next/headers';
import Link from 'next/link';
import { z } from 'zod';

import { DealCard } from '@/components/deal-card';
import { RetryButton } from '@/components/retry-button';
import { buttonVariants } from '@/components/ui/button';
import { deepCamel } from '@/lib/case';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Deal discovery' };

// Fetch deals live from the agents service per request (not at build time).
export const dynamic = 'force-dynamic';
// The agents service runs on a free tier that sleeps when idle. Allow headroom
// for a cold start, but fail gracefully (never a gateway 504) if it's too slow.
export const maxDuration = 30;

const Deals = z.array(Deal);
const RISKS = ['', 'low', 'medium', 'high'] as const;
const AGENTS_URL = process.env.AGENTS_URL ?? 'http://localhost:8000';

async function fetchDeals(riskTier?: string): Promise<{ deals: Deal[]; error: string | null }> {
  try {
    const qs = riskTier ? `?risk_tier=${riskTier}` : '';
    const res = await fetch(`${AGENTS_URL}/deals${qs}`, {
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

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ riskTier?: string }>;
}) {
  const { riskTier } = await searchParams;
  const { deals, error } = await fetchDeals(riskTier);
  // Format currency in the visitor's locale (server render has no browser locale).
  const locale =
    (await headers()).get('accept-language')?.split(',')[0]?.split(';')[0]?.trim() || undefined;

  return (
    <main id="main" className="px-safe max-w-3xl py-12">
      <h1 className="font-mono uppercase text-2xl font-semibold tracking-tight">Deal discovery</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Browse sourced alternative-asset opportunities — sorted by projected yield.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {RISKS.map((r) => {
          const active = (riskTier ?? '') === r;
          return (
            <Link
              key={r || 'all'}
              href={r ? `/app/deals?riskTier=${r}` : '/app/deals'}
              aria-current={active ? 'true' : undefined}
              className={cn(
                buttonVariants({ variant: active ? 'default' : 'outline', size: 'sm' }),
                'capitalize',
              )}
            >
              {r === '' ? 'All' : `${r} risk`}
            </Link>
          );
        })}
      </div>

      {error && (
        <div role="alert" className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-destructive">{error}</span>
          <RetryButton />
        </div>
      )}

      <h2 className="mb-3 mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Sourced deals{deals.length > 0 ? ` · ${deals.length}` : ''}
      </h2>
      <div className="grid gap-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} locale={locale} />
        ))}
        {!error && deals.length === 0 && (
          <p className="text-sm text-muted-foreground">No deals match that filter.</p>
        )}
      </div>
    </main>
  );
}
