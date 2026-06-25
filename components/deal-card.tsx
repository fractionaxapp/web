import type { Deal } from '@fractionax/domain';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMinor } from '@/lib/utils';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium tabular-nums">{value}</div>
    </div>
  );
}

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{deal.title}</CardTitle>
          <Badge variant={deal.riskTier}>{deal.riskTier} risk</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
        <Stat label="Projected yield" value={`${deal.projectedYieldPct}%`} />
        <Stat label="Minimum" value={formatMinor(deal.minInvestmentMinor, deal.currency)} />
        <Stat label="Jurisdiction" value={deal.jurisdiction} />
      </CardContent>
    </Card>
  );
}
