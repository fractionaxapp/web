import { Deal } from '@fractionax/domain';
import Link from 'next/link';
import { z } from 'zod';

import { DealCard } from '@/components/deal-card';
import { buttonVariants } from '@/components/ui/button';
import { deepCamel } from '@/lib/case';
import { cn } from '@/lib/utils';

// Fetch deals live from the agents service per request (not at build time).
export const dynamic = 'force-dynamic';

const Deals = z.array(Deal);
const RISKS = ['', 'low', 'medium', 'high'] as const;
const AGENTS_URL = process.env.AGENTS_URL ?? 'http://localhost:8000';

async function fetchDeals(riskTier?: string): Promise<{ deals: Deal[]; error: string | null }> {
  try {
    const qs = riskTier ? `?risk_tier=${riskTier}` : '';
    const res = await fetch(`${AGENTS_URL}/deals${qs}`, { cache: 'no-store' });
    if (!res.ok) return { deals: [], error: `Agents service error (${res.status})` };
    const parsed = Deals.safeParse(deepCamel(await res.json()));
    if (!parsed.success) return { deals: [], error: 'Unexpected response shape.' };
    return { deals: parsed.data, error: null };
  } catch {
    return { deals: [], error: 'Agents service unreachable.' };
  }
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ riskTier?: string }>;
}) {
  const { riskTier } = await searchParams;
  const { deals, error } = await fetchDeals(riskTier);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Deal discovery</h1>
      <p className="mt-1 text-muted-foreground">
        Browse sourced alternative-asset opportunities — sorted by projected yield.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {RISKS.map((r) => (
          <Link
            key={r || 'all'}
            href={r ? `/deals?riskTier=${r}` : '/deals'}
            className={cn(
              buttonVariants({ variant: (riskTier ?? '') === r ? 'default' : 'outline', size: 'sm' }),
              'capitalize',
            )}
          >
            {r === '' ? 'All' : `${r} risk`}
          </Link>
        ))}
      </div>

      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

      <div className="mt-6 grid gap-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        {!error && deals.length === 0 && (
          <p className="text-sm text-muted-foreground">No deals match that filter.</p>
        )}
      </div>
    </main>
  );
}
