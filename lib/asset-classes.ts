import type { Deal } from '@fractionax/domain';

/** The nine alternative-asset classes Fractionax organizes deals under. Order
 * here is the order shown in the class rail. Labels are kept short to fit it. */
export const ASSET_CLASSES = [
  { key: 'real_estate', label: 'Real estate' },
  { key: 'private_credit', label: 'Private credit' },
  { key: 'invoice', label: 'Invoices' },
  { key: 'ip_royalty', label: 'IP & royalties' },
  { key: 'revenue_share', label: 'Revenue share' },
  { key: 'trade_finance', label: 'Trade finance' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'carbon', label: 'Carbon credits' },
  { key: 'collectibles', label: 'Collectibles' },
] as const;

export type AssetClassKey = (typeof ASSET_CLASSES)[number]['key'];

export const CLASS_KEYS = ASSET_CLASSES.map((c) => c.key) as readonly AssetClassKey[];

const LABEL = new Map(ASSET_CLASSES.map((c) => [c.key, c.label]));
export const classLabel = (key: string): string => LABEL.get(key as AssetClassKey) ?? key;

export const isAssetClass = (v: string | undefined): v is AssetClassKey =>
  !!v && (CLASS_KEYS as readonly string[]).includes(v);

// Heuristics for current demo data (ids/titles), checked in order. The three
// id-encoded kinds (revshare/invoice/royalty) win first so they stay accurate.
const RULES: ReadonlyArray<readonly [RegExp, AssetClassKey]> = [
  [/revshare|rev[_-]?share/i, 'revenue_share'],
  [/invoice|receivable|factor/i, 'invoice'],
  [/royalty|ip[_-]|music|patent|trademark|licen/i, 'ip_royalty'],
  [/real|estate|property|apartment|lease|land|reit/i, 'real_estate'],
  [/credit|loan|debt|private|note/i, 'private_credit'],
  [/trade|supply|export|import|freight/i, 'trade_finance'],
  [/infra|equip|machin|solar|turbine|fleet/i, 'infrastructure'],
  [/carbon|green|sustain|offset|renewable/i, 'carbon'],
  [/art|collect|wine|watch|memorabilia/i, 'collectibles'],
];

/** A deal's asset class. Prefers an explicit `assetClass` from the backend (once
 * the agents populate it); otherwise derives one from the id/asset/title so the
 * class rail works with today's data. */
export function classOf(deal: Deal): AssetClassKey {
  const explicit = (deal as { assetClass?: string }).assetClass;
  if (isAssetClass(explicit)) return explicit;
  const hay = `${deal.id} ${deal.assetId} ${deal.title}`;
  for (const [re, key] of RULES) if (re.test(hay)) return key;
  return 'revenue_share';
}
