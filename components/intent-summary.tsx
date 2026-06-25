import type { InvestmentIntent } from '@fractionax/domain';

import { formatMinor, humanize, regionName } from '@/lib/utils';

const ACTION_LABELS: Record<string, string> = {
  invest: 'Invest',
  discover: 'Discover',
  rebalance: 'Rebalance',
};

/** A polished, human-readable summary of the agent's parsed intent — labeled
 * fields with country names and real words, not raw schema codes. */
export function IntentSummary({ intent }: { intent: InvestmentIntent }) {
  const fields: { label: string; value: string }[] = [
    { label: 'Action', value: ACTION_LABELS[intent.action] ?? humanize(intent.action) },
  ];
  if (intent.amountMinor)
    fields.push({ label: 'Amount', value: formatMinor(intent.amountMinor, intent.currency ?? 'USD') });
  if (intent.riskTier) fields.push({ label: 'Risk', value: `${humanize(intent.riskTier)} risk` });
  if (intent.assetKind) fields.push({ label: 'Asset', value: humanize(intent.assetKind) });
  if (intent.jurisdiction)
    fields.push({ label: 'Jurisdiction', value: regionName(intent.jurisdiction) });

  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {fields.map((f) => (
        <div key={f.label}>
          <dt className="text-xs text-muted-foreground">{f.label}</dt>
          <dd className="font-medium">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
