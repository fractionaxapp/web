import Link from 'next/link';

import { ASSET_CLASSES } from '@/lib/asset-classes';
import { buildHref, type DealsParams } from '@/lib/deals-query';
import { cn } from '@/lib/utils';

/** Primary navigation for the deals page: the nine asset classes with counts and
 * a neon-teal HUD bar on the active class. Always shows all nine so the taxonomy
 * is visible even when a class is empty. */
export function ClassRail({
  params,
  counts,
  totalAll,
}: {
  params: DealsParams;
  counts: Record<string, number>;
  totalAll: number;
}) {
  const items = [
    { key: undefined as DealsParams['class'], label: 'All', count: totalAll },
    ...ASSET_CLASSES.map((c) => ({ key: c.key, label: c.label, count: counts[c.key] ?? 0 })),
  ];

  return (
    <nav aria-label="Asset classes" className="flex flex-col gap-0.5">
      {items.map((it) => {
        const active = (params.class ?? undefined) === it.key;
        return (
          <Link
            key={it.key ?? 'all'}
            href={buildHref(params, { class: it.key })}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-h-11 touch-manipulation items-center justify-between gap-3 border-l-2 px-3 font-mono text-xs uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'border-primary bg-accent text-foreground'
                : 'border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
          >
            <span className="truncate">{it.label}</span>
            <span className="shrink-0 tabular-nums opacity-70">{it.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
