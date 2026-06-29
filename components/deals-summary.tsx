import type { DealsSummary } from '@/lib/deals-query';
import { cn, formatMinor } from '@/lib/utils';

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card px-4 py-3">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          'mt-0.5 font-mono text-lg font-semibold tabular-nums',
          accent ? 'text-brand-gold' : 'text-foreground',
        )}
      >
        {value}
      </div>
    </div>
  );
}

/** At-a-glance stats for the current (filtered) set — total, average yield,
 * minimum-investment range, and the risk mix. */
export function DealsSummary({ summary, locale }: { summary: DealsSummary; locale?: string }) {
  if (summary.total === 0) return null;
  const { total, avgYield, minLo, minHi, currency, risk } = summary;
  const range =
    minLo === minHi
      ? formatMinor(minLo, currency, locale)
      : `${formatMinor(minLo, currency, locale)} – ${formatMinor(minHi, currency, locale)}`;

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden border bg-border sm:grid-cols-4">
      <Stat label="Assets" value={total.toLocaleString(locale)} />
      <Stat label="Avg yield" value={`${avgYield.toFixed(1)}%`} accent />
      <Stat label="Min range" value={range} />
      <div className="bg-card px-4 py-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Risk mix
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-sm tabular-nums">
          <span className="whitespace-nowrap">
            <span className="text-muted-foreground">L</span> {risk.low}
          </span>
          <span className="whitespace-nowrap">
            <span className="text-muted-foreground">M</span> {risk.medium}
          </span>
          <span className="whitespace-nowrap">
            <span className="text-muted-foreground">H</span> {risk.high}
          </span>
        </div>
      </div>
    </div>
  );
}
