import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { classLabel } from '@/lib/asset-classes';
import { buildHref, type DealRow, type DealsParams } from '@/lib/deals-query';
import { cn, formatMinor, formatMinorCompact, regionName } from '@/lib/utils';

const th =
  'sticky top-0 z-10 border-b bg-muted px-3 py-2 font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground';
const focusRing = 'rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** A sortable numeric column header — a link that toggles asc/desc on the URL. */
function SortableTh({
  label,
  col,
  params,
  className,
}: {
  label: string;
  col: 'yield' | 'min' | 'raise';
  params: DealsParams;
  className?: string;
}) {
  const isActive = params.sort === col;
  const nextDir = isActive && params.dir === 'desc' ? 'asc' : 'desc';
  return (
    <th scope="col" className={cn(th, 'text-right', className)} aria-sort={isActive ? (params.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <Link
        href={buildHref(params, { sort: col, dir: nextDir })}
        aria-label={`Sort by ${label}, ${nextDir === 'asc' ? 'ascending' : 'descending'}`}
        className={cn('inline-flex items-center gap-1 hover:text-foreground', focusRing)}
      >
        {label}
        <span aria-hidden className={cn('text-[10px]', isActive ? 'text-primary' : 'text-muted-foreground/40')}>
          {isActive ? (params.dir === 'desc' ? '↓' : '↑') : '↕'}
        </span>
      </Link>
    </th>
  );
}

export function DealsTable({
  rows,
  params,
  locale,
}: {
  rows: DealRow[];
  params: DealsParams;
  locale?: string;
}) {
  return (
    <div className="max-h-[34rem] overflow-auto border">
      <table className="w-full min-w-0 text-sm sm:min-w-[640px]">
        <thead>
          <tr>
            <th scope="col" className={cn(th, 'text-left')}>
              Asset
            </th>
            <th scope="col" className={cn(th, 'hidden text-left sm:table-cell')}>
              Class
            </th>
            <SortableTh label="Yield" col="yield" params={params} />
            <SortableTh label="Min" col="min" params={params} className="hidden sm:table-cell" />
            <SortableTh
              label="Offering size"
              col="raise"
              params={params}
              className="hidden lg:table-cell"
            />
            <th scope="col" className={cn(th, 'hidden text-left md:table-cell')}>
              Jurisdiction
            </th>
            <th scope="col" className={cn(th, 'text-left')}>
              Risk
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} className="border-b transition-colors last:border-0 hover:bg-accent/40">
              <td className="px-3 py-2.5">
                <Link href={`/app/deals/${d.id}`} className={cn('font-medium hover:text-primary hover:underline', focusRing)}>
                  {d.title}
                </Link>
              </td>
              <td className="hidden px-3 py-2.5 text-muted-foreground sm:table-cell">
                {classLabel(d.assetClass)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                {d.projectedYieldPct > 0 ? (
                  <span className="text-brand-gold">{d.projectedYieldPct}%</span>
                ) : (
                  <span className="text-muted-foreground/60" title="No published yield">
                    —
                  </span>
                )}
              </td>
              <td className="hidden px-3 py-2.5 text-right font-mono tabular-nums sm:table-cell">
                {formatMinor(d.minInvestmentMinor, d.currency, locale)}
              </td>
              <td className="hidden px-3 py-2.5 text-right font-mono tabular-nums text-muted-foreground lg:table-cell">
                {formatMinorCompact(d.targetRaiseMinor, d.currency, locale)}
              </td>
              <td className="hidden px-3 py-2.5 text-muted-foreground md:table-cell">
                {regionName(d.jurisdiction)}
              </td>
              <td className="px-3 py-2.5">
                <Badge variant={d.riskTier}>{d.riskTier}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
