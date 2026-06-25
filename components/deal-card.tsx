import type { Deal } from '@fractionax/domain';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMinor, regionName } from '@/lib/utils';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  );
}

export function DealCard({ deal, locale }: { deal: Deal; locale?: string }) {
  const memoPrompt = `Draft an investment memo for ${deal.title}`;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{deal.title}</CardTitle>
          <Badge variant={deal.riskTier}>{deal.riskTier} risk</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <div className="text-xs text-muted-foreground">Projected yield</div>
            <div className="text-2xl font-semibold tabular-nums text-primary">
              {deal.projectedYieldPct}%
            </div>
          </div>
          <Stat label="Minimum" value={formatMinor(deal.minInvestmentMinor, deal.currency, locale)} />
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
