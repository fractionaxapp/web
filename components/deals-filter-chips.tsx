import Link from 'next/link';

import { classLabel } from '@/lib/asset-classes';
import { buildHref, type DealsParams } from '@/lib/deals-query';

const chip =
  'inline-flex min-h-9 touch-manipulation items-center gap-1.5 rounded-none border bg-secondary px-2.5 font-mono text-xs text-secondary-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [@media(pointer:coarse)]:min-h-11';

/** The active filters as removable chips, plus Clear all — so a stacked filter
 * state is legible and reversible at a glance. */
export function DealsFilterChips({ params }: { params: DealsParams }) {
  const chips: { key: string; label: string; clear: Partial<DealsParams> }[] = [];
  if (params.class) chips.push({ key: 'class', label: classLabel(params.class), clear: { class: undefined } });
  if (params.risk) chips.push({ key: 'risk', label: `${params.risk} risk`, clear: { risk: undefined } });
  if (params.minYield)
    chips.push({ key: 'minYield', label: `yield ≥ ${params.minYield}%`, clear: { minYield: undefined } });
  if (params.maxMin)
    chips.push({ key: 'maxMin', label: `min ≤ ${params.maxMin.toLocaleString()}`, clear: { maxMin: undefined } });
  if (params.q) chips.push({ key: 'q', label: `“${params.q}”`, clear: { q: '' } });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <Link key={c.key} href={buildHref(params, c.clear)} aria-label={`Remove filter: ${c.label}`} className={chip}>
          <span className="max-w-[22ch] truncate">{c.label}</span>
          <span aria-hidden>✕</span>
        </Link>
      ))}
      <Link
        href="/app/deals"
        className="inline-flex min-h-9 touch-manipulation items-center px-2 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [@media(pointer:coarse)]:min-h-11"
      >
        Clear all
      </Link>
    </div>
  );
}
