import { headers } from 'next/headers';
import Link from 'next/link';

import { ExpressInterest } from '@/components/express-interest';
import { RetryButton } from '@/components/retry-button';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchDeal } from '@/lib/deals';
import { cn, formatMinor, humanize, regionName } from '@/lib/utils';

export const metadata = { title: 'Deal' };
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div
          className={cn(
            'mt-1 font-mono text-xl font-semibold tabular-nums',
            accent ? 'text-brand-gold' : 'text-foreground',
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { deal, error } = await fetchDeal(id);
  const locale =
    (await headers()).get('accept-language')?.split(',')[0]?.split(';')[0]?.trim() || undefined;

  const backLink =
    'inline-flex rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <main id="main" className="px-safe max-w-3xl py-12">
      <Link href="/app/deals" className={backLink}>
        ← All deals
      </Link>

      {error && !deal && (
        <div className="mt-10">
          <h1 className="text-2xl font-semibold tracking-tight">Couldn’t load this deal</h1>
          <div role="alert" className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-destructive">{error}</span>
            <RetryButton />
          </div>
        </div>
      )}

      {!deal && !error && (
        <div className="mt-10">
          <p className="font-mono text-sm text-muted-foreground">404</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Deal not found</h1>
          <p className="mt-1 text-muted-foreground">
            This deal doesn’t exist or is no longer available.
          </p>
          <Link href="/app/deals" className={cn(buttonVariants(), 'mt-4 h-10 px-4')}>
            Browse deals
          </Link>
        </div>
      )}

      {deal && (
        <>
          <div className="mt-4 flex items-start justify-between gap-4">
            <h1 className="text-balance text-2xl font-semibold tracking-tight">{deal.title}</h1>
            <Badge variant={deal.riskTier}>{deal.riskTier} risk</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            {regionName(deal.jurisdiction)} · {humanize(deal.status)} · sourced{' '}
            {new Date(deal.sourcedAt).toLocaleDateString(locale)}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Projected yield" value={`${deal.projectedYieldPct}%`} accent />
            <Stat label="Minimum" value={formatMinor(deal.minInvestmentMinor, deal.currency, locale)} />
            <Stat
              label="Target raise"
              value={formatMinor(deal.targetRaiseMinor, deal.currency, locale)}
            />
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Invest
            </h2>
            <ExpressInterest deal={deal} locale={locale} />
          </div>

          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-muted-foreground">Want the agents to underwrite it first?</p>
            <Link
              href={`/app?q=${encodeURIComponent(`Draft an investment memo for ${deal.title}`)}`}
              className="mt-1 inline-flex rounded text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Draft a memo with Copilot →
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
