import type { Deal } from '@fractionax/domain';

import { classOf, isAssetClass, type AssetClassKey } from './asset-classes';

export const PER_PAGE = 20;
export const SORTS = ['yield', 'min', 'recent'] as const;
export type SortKey = (typeof SORTS)[number];
const RISKS = ['low', 'medium', 'high'] as const;
type Risk = (typeof RISKS)[number];

export type DealsParams = {
  class?: AssetClassKey;
  risk?: Risk;
  sort: SortKey;
  dir: 'asc' | 'desc';
  q: string;
  page: number;
};

export type DealRow = Deal & { assetClass: AssetClassKey };

export function parseParams(sp: Record<string, string | undefined>): DealsParams {
  return {
    class: isAssetClass(sp.class) ? sp.class : undefined,
    risk: (RISKS as readonly string[]).includes(sp.risk ?? '') ? (sp.risk as Risk) : undefined,
    sort: (SORTS as readonly string[]).includes(sp.sort ?? '') ? (sp.sort as SortKey) : 'yield',
    dir: sp.dir === 'asc' ? 'asc' : 'desc',
    q: (sp.q ?? '').trim(),
    page: Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1),
  };
}

/** Build a deals URL, merging a patch. Any filter/sort change resets to page 1
 * unless `page` is explicitly patched. */
export function buildHref(p: DealsParams, patch: Partial<DealsParams>): string {
  const m = { ...p, ...patch };
  if (!('page' in patch)) m.page = 1;
  const sp = new URLSearchParams();
  if (m.class) sp.set('class', m.class);
  if (m.risk) sp.set('risk', m.risk);
  if (m.sort !== 'yield') sp.set('sort', m.sort);
  if (m.dir !== 'desc') sp.set('dir', m.dir);
  if (m.q) sp.set('q', m.q);
  if (m.page > 1) sp.set('page', String(m.page));
  const s = sp.toString();
  return s ? `/app/deals?${s}` : '/app/deals';
}

// NOTE: at 1100+ assets the agents /deals endpoint should accept
// class/risk/sort/q/page+limit and return one page plus a total, moving this
// work server-side. For now we fetch the set once and select here.
export function selectDeals(all: Deal[], p: DealsParams) {
  const tagged = all.map((deal) => ({ deal, cls: classOf(deal) }));

  const counts: Record<string, number> = {};
  for (const { cls } of tagged) counts[cls] = (counts[cls] ?? 0) + 1;

  let rows = tagged;
  if (p.class) rows = rows.filter((r) => r.cls === p.class);
  if (p.risk) rows = rows.filter((r) => r.deal.riskTier === p.risk);
  if (p.q) {
    const q = p.q.toLowerCase();
    rows = rows.filter((r) => `${r.deal.title} ${r.deal.jurisdiction}`.toLowerCase().includes(q));
  }

  const sign = p.dir === 'asc' ? 1 : -1;
  rows = [...rows].sort((a, b) => {
    if (p.sort === 'min') return sign * (a.deal.minInvestmentMinor - b.deal.minInvestmentMinor);
    if (p.sort === 'recent') return sign * (Date.parse(a.deal.sourcedAt) - Date.parse(b.deal.sourcedAt));
    return sign * (a.deal.projectedYieldPct - b.deal.projectedYieldPct);
  });

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(p.page, pageCount);
  const start = (page - 1) * PER_PAGE;
  const pageRows: DealRow[] = rows
    .slice(start, start + PER_PAGE)
    .map((r) => ({ ...r.deal, assetClass: r.cls }));

  return { counts, total, page, pageCount, pageRows, totalAll: all.length };
}
