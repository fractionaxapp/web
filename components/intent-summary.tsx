import type { InvestmentIntent } from '@fractionax/domain';

import { Badge } from '@/components/ui/badge';
import { formatMinor } from '@/lib/utils';

export function IntentSummary({ intent }: { intent: InvestmentIntent }) {
  const chips: string[] = [`action: ${intent.action}`];
  if (intent.amountMinor)
    chips.push(`amount: ${formatMinor(intent.amountMinor, intent.currency ?? 'USD')}`);
  if (intent.riskTier) chips.push(`risk: ${intent.riskTier}`);
  if (intent.jurisdiction) chips.push(`jurisdiction: ${intent.jurisdiction}`);
  if (intent.assetKind) chips.push(`asset: ${intent.assetKind.replaceAll('_', ' ')}`);

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
