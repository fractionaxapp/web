'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { ASSET_CLASSES } from '@/lib/asset-classes';
import { buildHref, PER_PAGE_OPTIONS, type DealsParams, type SortKey } from '@/lib/deals-query';
import { cn } from '@/lib/utils';

const YIELD_STEPS = [5, 8, 10, 12, 15];
const MIN_STEPS = [250, 500, 1000, 5000];
const numOrUndef = (v: string) => (v ? Number(v) : undefined);

const selectCls =
  'h-10 rounded-none border bg-background px-2 font-mono text-xs uppercase tracking-[0.08em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** Search + class (mobile) + risk + sort. Each control writes to the URL so the
 * view is deep-linkable and survives refresh; the server re-selects from there. */
export function DealsControls({ params }: { params: DealsParams }) {
  const router = useRouter();
  const [q, setQ] = useState(params.q);
  const [showFilters, setShowFilters] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function search(value: string) {
    setQ(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => router.replace(buildHref(params, { q: value.trim() }), { scroll: false }),
      300,
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <form
          role="search"
          className="min-w-40 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            clearTimeout(timerRef.current);
            router.replace(buildHref(params, { q: q.trim() }), { scroll: false });
          }}
        >
          <label htmlFor="deals-search" className="sr-only">
            Search assets
          </label>
          <input
            id="deals-search"
            type="search"
            name="q"
            autoComplete="off"
            value={q}
            onChange={(e) => search(e.target.value)}
            placeholder="Search assets…"
            className="h-10 w-full rounded-none border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
          />
        </form>

        {/* Mobile only: collapse the secondary filters so search + class lead. */}
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-controls="deals-filters"
          className={cn(selectCls, 'inline-flex items-center gap-1 sm:hidden')}
        >
          Filters
          <span aria-hidden>{showFilters ? '▴' : '▾'}</span>
        </button>
      </div>

      <div
        id="deals-filters"
        className={cn('flex-wrap items-center gap-2', showFilters ? 'flex' : 'hidden', 'sm:flex')}
      >
        {/* Class picker — mobile only; desktop uses the rail. */}
      <label htmlFor="deals-class" className="sr-only">
        Asset class
      </label>
      <select
        id="deals-class"
        className={cn(selectCls, 'lg:hidden')}
        value={params.class ?? ''}
        onChange={(e) => router.push(buildHref(params, { class: (e.target.value || undefined) as DealsParams['class'] }))}
      >
        <option value="">All classes</option>
        {ASSET_CLASSES.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>

      <label htmlFor="deals-risk" className="sr-only">
        Risk tier
      </label>
      <select
        id="deals-risk"
        className={selectCls}
        value={params.risk ?? ''}
        onChange={(e) => router.push(buildHref(params, { risk: (e.target.value || undefined) as DealsParams['risk'] }))}
      >
        <option value="">All risk</option>
        <option value="low">Low risk</option>
        <option value="medium">Medium risk</option>
        <option value="high">High risk</option>
      </select>

      <label htmlFor="deals-yield" className="sr-only">
        Minimum yield
      </label>
      <select
        id="deals-yield"
        className={selectCls}
        value={params.minYield ?? ''}
        onChange={(e) => router.push(buildHref(params, { minYield: numOrUndef(e.target.value) }))}
      >
        <option value="">Any yield</option>
        {YIELD_STEPS.map((y) => (
          <option key={y} value={y}>
            Yield ≥ {y}%
          </option>
        ))}
      </select>

      <label htmlFor="deals-min" className="sr-only">
        Maximum minimum investment
      </label>
      <select
        id="deals-min"
        className={selectCls}
        value={params.maxMin ?? ''}
        onChange={(e) => router.push(buildHref(params, { maxMin: numOrUndef(e.target.value) }))}
      >
        <option value="">Any minimum</option>
        {MIN_STEPS.map((m) => (
          <option key={m} value={m}>
            Min ≤ {m.toLocaleString()}
          </option>
        ))}
      </select>

      <label htmlFor="deals-sort" className="sr-only">
        Sort
      </label>
      <select
        id="deals-sort"
        className={selectCls}
        value={`${params.sort}:${params.dir}`}
        onChange={(e) => {
          const [sort, dir] = e.target.value.split(':') as [SortKey, 'asc' | 'desc'];
          router.push(buildHref(params, { sort, dir }));
        }}
      >
        <option value="yield:desc">Yield: high to low</option>
        <option value="yield:asc">Yield: low to high</option>
        <option value="min:asc">Min: low to high</option>
        <option value="min:desc">Min: high to low</option>
        <option value="raise:desc">Offering size: largest first</option>
        <option value="raise:asc">Offering size: smallest first</option>
        <option value="recent:desc">Newest first</option>
      </select>

      <label htmlFor="deals-perpage" className="sr-only">
        Results per page
      </label>
      <select
        id="deals-perpage"
        className={selectCls}
        value={params.perPage}
        onChange={(e) => router.push(buildHref(params, { perPage: Number(e.target.value) }))}
      >
        {PER_PAGE_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n} / page
          </option>
        ))}
      </select>
      </div>
    </div>
  );
}
