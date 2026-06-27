import Link from 'next/link';

import { buildHref, type DealsParams } from '@/lib/deals-query';
import { cn } from '@/lib/utils';

const cell =
  'inline-flex h-10 min-w-10 touch-manipulation items-center justify-center rounded-none border px-2 font-mono text-xs tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** A compact page window: 1 … p-1 p p+1 … n (gaps keyed distinctly). */
function windowOf(page: number, count: number): (number | 'gap-lo' | 'gap-hi')[] {
  const out: (number | 'gap-lo' | 'gap-hi')[] = [1];
  const lo = Math.max(2, page - 1);
  const hi = Math.min(count - 1, page + 1);
  if (lo > 2) out.push('gap-lo');
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < count - 1) out.push('gap-hi');
  if (count > 1) out.push(count);
  return out;
}

export function DealsPagination({
  params,
  page,
  pageCount,
  total,
}: {
  params: DealsParams;
  page: number;
  pageCount: number;
  total: number;
}) {
  const from = (page - 1) * params.perPage + 1;
  const to = Math.min(total, page * params.perPage);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="font-mono text-xs text-muted-foreground tabular-nums">
        {from}–{to} of {total}
      </p>

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Link
            href={buildHref(params, { page: Math.max(1, page - 1) })}
            aria-label="Previous page"
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
            className={cn(cell, page === 1 && 'pointer-events-none opacity-40')}
          >
            ‹
          </Link>

          {windowOf(page, pageCount).map((p) =>
            typeof p === 'string' ? (
              <span key={p} aria-hidden className="px-1 font-mono text-xs text-muted-foreground">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={buildHref(params, { page: p })}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                className={cn(cell, p === page ? 'border-primary bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {p}
              </Link>
            ),
          )}

          <Link
            href={buildHref(params, { page: Math.min(pageCount, page + 1) })}
            aria-label="Next page"
            aria-disabled={page === pageCount}
            tabIndex={page === pageCount ? -1 : undefined}
            className={cn(cell, page === pageCount && 'pointer-events-none opacity-40')}
          >
            ›
          </Link>
        </nav>
      )}
    </div>
  );
}
