import type { Deal } from '@fractionax/domain';

import { classOf, isAssetClass, type AssetClassKey } from './asset-classes';

export const PER_PAGE_OPTIONS = [20, 50, 100] as const;
export const DEFAULT_PER_PAGE = 20;
export const SORTS = ['yield', 'min', 'raise', 'recent'] as const;
export type SortKey = (typeof SORTS)[number];
export const VIEWS = ['table', 'cards'] as const;
export type ViewKey = (typeof VIEWS)[number];
const RISKS = ['low', 'medium', 'high'] as const;
type Risk = (typeof RISKS)[number];

export type DealsParams = {
  class?: AssetClassKey;
  risk?: Risk;
  minYield?: number; // projected yield ≥ this percent
  maxMin?: number; // minimum investment ≤ this (major units)
  sort: SortKey;
  dir: 'asc' | 'desc';
  q: string;
  view: ViewKey;
  perPage: number;
  page: number;
};

export type DealRow = Deal & { assetClass: AssetClassKey };

export type DealsSummary = {
  total: number;
  avgYield: number;
  minLo: number;
  minHi: number;
  currency: string;
  risk: { low: number; medium: number; high: number };
};

const num = (v: string | undefined): number | undefined => {
  const n = Number.parseFloat(v ?? '');
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export function parseParams(sp: Record<string, string | undefined>): DealsParams {
  const perPage = Number.parseInt(sp.perPage ?? '', 10);
  return {
    class: isAssetClass(sp.class) ? sp.class : undefined,
    risk: (RISKS as readonly string[]).includes(sp.risk ?? '') ? (sp.risk as Risk) : undefined,
    minYield: num(sp.minYield),
    maxMin: num(sp.maxMin),
    sort: (SORTS as readonly string[]).includes(sp.sort ?? '') ? (sp.sort as SortKey) : 'yield',
    dir: sp.dir === 'asc' ? 'asc' : 'desc',
    q: (sp.q ?? '').trim(),
    view: (VIEWS as readonly string[]).includes(sp.view ?? '') ? (sp.view as ViewKey) : 'table',
    perPage: (PER_PAGE_OPTIONS as readonly number[]).includes(perPage) ? perPage : DEFAULT_PER_PAGE,
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
  if (m.minYield) sp.set('minYield', String(m.minYield));
  if (m.maxMin) sp.set('maxMin', String(m.maxMin));
  if (m.sort !== 'yield') sp.set('sort', m.sort);
  if (m.dir !== 'desc') sp.set('dir', m.dir);
  if (m.q) sp.set('q', m.q);
  if (m.view !== 'table') sp.set('view', m.view);
  if (m.perPage !== DEFAULT_PER_PAGE) sp.set('perPage', String(m.perPage));
  if (m.page > 1) sp.set('page', String(m.page));
  const s = sp.toString();
  return s ? `/app/deals?${s}` : '/app/deals';
}

// NOTE: at 1100+ assets the agents /deals endpoint should accept these filters +
// page/limit and return one page plus aggregates, moving this work server-side.
// For now we fetch the set once and select + summarize here.
export function selectDeals(all: Deal[], p: DealsParams) {
  const tagged = all.map((deal) => ({ deal, cls: classOf(deal) }));

  const counts: Record<string, number> = {};
  for (const { cls } of tagged) counts[cls] = (counts[cls] ?? 0) + 1;

  let rows = tagged;
  if (p.class) rows = rows.filter((r) => r.cls === p.class);
  if (p.risk) rows = rows.filter((r) => r.deal.riskTier === p.risk);
  if (p.minYield) rows = rows.filter((r) => r.deal.projectedYieldPct >= p.minYield!);
  if (p.maxMin) rows = rows.filter((r) => r.deal.minInvestmentMinor <= p.maxMin! * 100);
  if (p.q) {
    const q = p.q.toLowerCase();
    rows = rows.filter((r) => `${r.deal.title} ${r.deal.jurisdiction}`.toLowerCase().includes(q));
  }

  const sign = p.dir === 'asc' ? 1 : -1;
  rows = [...rows].sort((a, b) => {
    if (p.sort === 'min') return sign * (a.deal.minInvestmentMinor - b.deal.minInvestmentMinor);
    if (p.sort === 'raise') return sign * (a.deal.targetRaiseMinor - b.deal.targetRaiseMinor);
    if (p.sort === 'recent') return sign * (Date.parse(a.deal.sourcedAt) - Date.parse(b.deal.sourcedAt));
    return sign * (a.deal.projectedYieldPct - b.deal.projectedYieldPct);
  });

  const total = rows.length;
  const summary: DealsSummary = {
    total,
    avgYield: total ? rows.reduce((s, r) => s + r.deal.projectedYieldPct, 0) / total : 0,
    minLo: rows.reduce((m, r) => Math.min(m, r.deal.minInvestmentMinor), Infinity),
    minHi: rows.reduce((m, r) => Math.max(m, r.deal.minInvestmentMinor), 0),
    currency: rows[0]?.deal.currency ?? 'USD',
    risk: {
      low: rows.filter((r) => r.deal.riskTier === 'low').length,
      medium: rows.filter((r) => r.deal.riskTier === 'medium').length,
      high: rows.filter((r) => r.deal.riskTier === 'high').length,
    },
  };

  const pageCount = Math.max(1, Math.ceil(total / p.perPage));
  const page = Math.min(p.page, pageCount);
  const start = (page - 1) * p.perPage;
  const pageRows: DealRow[] = rows
    .slice(start, start + p.perPage)
    .map((r) => ({ ...r.deal, assetClass: r.cls }));

  return { counts, total, page, pageCount, pageRows, totalAll: all.length, summary };
}
