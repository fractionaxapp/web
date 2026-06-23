import type { InvestmentIntent } from '@fractionax/domain';

import { Badge } from '@/components/ui/badge';

export function IntentSummary({ intent }: { intent: InvestmentIntent }) {
  const chips: string[] = [`action: ${intent.action}`];
  if (intent.amountMinor) chips.push(`amount: $${(intent.amountMinor / 100).toLocaleString()}`);
  if (intent.riskTier) chips.push(`risk: ${intent.riskTier}`);
  if (intent.jurisdiction) chips.push(`jurisdiction: ${intent.jurisdiction}`);
  if (intent.assetKind) chips.push(`asset: ${intent.assetKind.replace('_', ' ')}`);

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Badge key={chip} variant="secondary" className="normal-case">
          {chip}
        </Badge>
      ))}
    </div>
  );
}
