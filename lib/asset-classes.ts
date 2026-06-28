import type { Deal } from '@fractionax/domain';

/** Asset classes adopted from the rwa.xyz taxonomy (the catalogue seed uses
 * these slugs). Order here is the order shown in the class rail. */
export const ASSET_CLASSES = [
  { key: 'stocks', label: 'Stocks' },
  { key: 'stablecoins', label: 'Stablecoins' },
  { key: 'real-estate', label: 'Real estate' },
  { key: 'us-treasury-debt', label: 'US Treasury debt' },
  { key: 'commodities', label: 'Commodities' },
  { key: 'corporate-credit', label: 'Corporate credit' },
  { key: 'active-strategies', label: 'Active strategies' },
  { key: 'diversified-credit', label: 'Diversified credit' },
  { key: 'non-us-government-debt', label: 'Government debt' },
  { key: 'asset-backed-credit', label: 'Asset-backed credit' },
  { key: 'private-equity', label: 'Private equity' },
  { key: 'specialty-finance', label: 'Specialty finance' },
  { key: 'venture-capital', label: 'Venture capital' },
] as const;

export type AssetClassKey = (typeof ASSET_CLASSES)[number]['key'];

export const CLASS_KEYS = ASSET_CLASSES.map((c) => c.key) as readonly AssetClassKey[];

const LABEL = new Map(ASSET_CLASSES.map((c) => [c.key, c.label]));
export const classLabel = (key: string): string => LABEL.get(key as AssetClassKey) ?? key;

export const isAssetClass = (v: string | undefined): v is AssetClassKey =>
  !!v && (CLASS_KEYS as readonly string[]).includes(v);

// Fallback for legacy demo deals that predate `assetClass` (royalties, invoices,
// revenue-share), mapping them onto the nearest adopted class.
const FALLBACK: ReadonlyArray<readonly [RegExp, AssetClassKey]> = [
  [/invoice|receivable|factor/i, 'asset-backed-credit'],
  [/royalty|ip[_-]|music|patent|licen|revshare|rev[_-]?share|revenue|franchise/i, 'specialty-finance'],
];

/** A deal's asset class. Prefers the explicit `assetClass` from the catalogue;
 * falls back to id/title heuristics for the legacy demo deals. */
export function classOf(deal: Deal): AssetClassKey {
  if (isAssetClass(deal.assetClass)) return deal.assetClass;
  const hay = `${deal.id} ${deal.assetId} ${deal.title}`;
  for (const [re, key] of FALLBACK) if (re.test(hay)) return key;
  return 'specialty-finance';
}
