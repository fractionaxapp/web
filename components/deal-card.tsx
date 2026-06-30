import type { Deal } from '@fractionax/domain';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  cn,
  formatMinor,
  formatMinorCompact,
  isOutlierYield,
  OUTLIER_YIELD_HINT,
  regionName,
} from '@/lib/utils';

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn('font-medium', mono && 'font-mono tabular-nums')}>{value}</div>
    </div>
  );
}

export function DealCard({ deal, locale }: { deal: Deal; locale?: string }) {
  const memoPrompt = `Draft an investment memo for ${deal.title}`;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">
            <Link
              href={`/app/deals/${deal.id}`}
              className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {deal.title}
            </Link>
          </CardTitle>
          <Badge variant={deal.riskTier}>{deal.riskTier} risk</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <div className="text-xs text-muted-foreground">Projected yield</div>
            <div
              className={cn(
                'font-mono text-2xl font-semibold tabular-nums',
                deal.projectedYieldPct <= 0
                  ? 'text-muted-foreground/60'
                  : isOutlierYield(deal.projectedYieldPct)
                    ? 'text-foreground'
                    : 'text-brand-gold',
              )}
              title={
                deal.projectedYieldPct <= 0
                  ? 'No published yield'
                  : isOutlierYield(deal.projectedYieldPct)
                    ? OUTLIER_YIELD_HINT
                    : undefined
              }
            >
              {deal.projectedYieldPct > 0 ? `${deal.projectedYieldPct}%` : '—'}
            </div>
          </div>
          <Stat label="Minimum" value={formatMinor(deal.minInvestmentMinor, deal.currency, locale)} mono />
          <Stat
            label="Offering size"
            value={formatMinorCompact(deal.targetRaiseMinor, deal.currency, locale)}
            mono
          />
          <Stat label="Jurisdiction" value={regionName(deal.jurisdiction)} />
        </div>
        <Link
          href={`/app?q=${encodeURIComponent(memoPrompt)}`}
          className="inline-flex rounded text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Draft memo →
        </Link>
      </CardContent>
    </Card>
  );
}
