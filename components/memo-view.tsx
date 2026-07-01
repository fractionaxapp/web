import type { InvestmentMemo } from '@fractionax/domain';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatMinor, isOutlierYield } from '@/lib/utils';

// Unambiguous verdict labels — the raw enum's "pass" reads as ambiguous on a
// badge (decline vs. "passed"); "Skip" is clearly a decline.
const RECOMMENDATION_LABEL: Record<InvestmentMemo['recommendation'], string> = {
  invest: 'Consider',
  watch: 'Watch',
  pass: 'Skip',
};

function Stat({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={cn(
          'font-medium capitalize',
          mono && 'font-mono tabular-nums',
          accent && 'text-brand-gold',
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function MemoView({ memo, currency }: { memo: InvestmentMemo; currency: string }) {
  return (
    <Card className="border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Investment memo</CardTitle>
          <Badge>{RECOMMENDATION_LABEL[memo.recommendation]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="max-w-prose text-muted-foreground">{memo.summary}</p>
        <div className="flex flex-wrap gap-6">
          <Stat label="Valuation" value={formatMinor(memo.valuationMinor, currency)} mono />
          <Stat
            label="Projected yield"
            value={`${memo.projectedYieldPct}%`}
            mono
            accent={!isOutlierYield(memo.projectedYieldPct)}
          />
          <Stat label="Risk tier" value={memo.riskTier} />
        </div>
        {memo.risks.length > 0 && (
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Risks
            </div>
            <ul className="max-w-prose space-y-2">
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
