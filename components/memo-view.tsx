import type { InvestmentMemo } from '@fractionax/domain';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMinor } from '@/lib/utils';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium capitalize">{value}</div>
    </div>
  );
}

export function MemoView({ memo, currency }: { memo: InvestmentMemo; currency: string }) {
  return (
    <Card className="border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Investment memo</CardTitle>
          <Badge>{memo.recommendation}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="text-muted-foreground">{memo.summary}</p>
        <div className="flex flex-wrap gap-6">
          <Stat label="Valuation" value={formatMinor(memo.valuationMinor, currency)} />
          <Stat label="Projected yield" value={`${memo.projectedYieldPct}%`} />
          <Stat label="Risk tier" value={memo.riskTier} />
        </div>
        {memo.risks.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Risks
            </div>
            <ul className="space-y-2">
              {memo.risks.map((risk) => (
                <li key={risk.title} className="flex gap-2">
                  <Badge variant={risk.severity}>{risk.severity}</Badge>
                  <div>
                    <span className="font-medium">{risk.title}.</span>{' '}
                    <span className="text-muted-foreground">{risk.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
