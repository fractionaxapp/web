import Link from 'next/link';

import { buildHref, type DealsParams, type ViewKey } from '@/lib/deals-query';
import { cn } from '@/lib/utils';

const TABS: { key: ViewKey; label: string }[] = [
  { key: 'table', label: 'Table' },
  { key: 'cards', label: 'Cards' },
];

/** Switch between the dense table (scanning) and a card grid (browsing). The
 * choice lives in the URL so it survives refresh and share. */
export function DealsViewToggle({ params }: { params: DealsParams }) {
  return (
    <div role="group" aria-label="View" className="inline-flex border">
      {TABS.map((t, i) => {
        const active = params.view === t.key;
        return (
          <Link
            key={t.key}
            href={buildHref(params, { view: t.key })}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'inline-flex min-h-10 touch-manipulation items-center px-3 font-mono text-xs uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              i > 0 && 'border-l',
              active ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
