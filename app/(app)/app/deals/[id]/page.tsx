import { headers } from 'next/headers';
import Link from 'next/link';

import { ExpressInterest } from '@/components/express-interest';
import { PageHeader } from '@/components/page-header';
import { RetryButton } from '@/components/retry-button';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { classLabel, classOf } from '@/lib/asset-classes';
import { fetchDeal } from '@/lib/deals';
import { cn, formatDate, formatMinor, humanize, isOutlierYield, regionName } from '@/lib/utils';

export const metadata = { title: 'Deal' };
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function Stat({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div
          className={cn(
            'mt-1 font-mono text-xl font-semibold tabular-nums',
            muted ? 'text-muted-foreground/60' : accent ? 'text-brand-gold' : 'text-foreground',
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
    <main id="main" className="px-safe mx-auto max-w-5xl py-12">
      <Link href="/app/deals" className={backLink}>
        ← All deals
      </Link>

      {error && !deal && (
        <div className="mt-10">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">Couldn’t load this deal</h1>
          <div role="alert" className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-destructive">{error}</span>
            <RetryButton />
          </div>
        </div>
      )}

      {!deal && !error && (
        <div className="mt-10">
          <p className="font-mono text-sm text-muted-foreground">404</p>
          <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight">Deal not found</h1>
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
          <div className="mt-6">
            <PageHeader
              kicker={`Opportunity · ${classLabel(classOf(deal))}`}
              title={deal.title}
              description={`${regionName(deal.jurisdiction)} · ${humanize(deal.status)} · sourced ${formatDate(deal.sourcedAt, locale)}`}
              action={<Badge variant={deal.riskTier}>{deal.riskTier} risk</Badge>}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat
              label="Projected yield"
              value={deal.projectedYieldPct > 0 ? `${deal.projectedYieldPct}%` : '—'}
              accent={deal.projectedYieldPct > 0 && !isOutlierYield(deal.projectedYieldPct)}
              muted={deal.projectedYieldPct === 0}
            />
            <Stat label="Minimum" value={formatMinor(deal.minInvestmentMinor, deal.currency, locale)} />
            <Stat
              label="Offering size"
              value={formatMinor(deal.targetRaiseMinor, deal.currency, locale)}
            />
          </div>

          <div className="mt-8">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Invest
            </h2>
            <ExpressInterest deal={deal} locale={locale} />
          </div>

          <div className="mt-8">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Details
            </h2>
            <Card>
              <CardContent className="p-0">
                <dl className="divide-y text-sm">
                  {[
                    { label: 'Asset class', value: classLabel(classOf(deal)), mono: false },
                    { label: 'Jurisdiction', value: regionName(deal.jurisdiction), mono: false },
                    { label: 'Currency', value: deal.currency, mono: true },
                    { label: 'Status', value: humanize(deal.status), mono: false },
                    {
                      label: 'Sourced',
                      value: formatDate(deal.sourcedAt, locale),
                      mono: false,
                    },
                    { label: 'Deal ID', value: deal.id, mono: true },
                    { label: 'Asset ID', value: deal.assetId, mono: true },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className={cn('text-right', row.mono && 'font-mono tabular-nums')}>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
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
