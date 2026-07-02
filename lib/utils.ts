import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names, resolving conflicts (shadcn convention). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Intl.NumberFormat construction isn't free; cache one formatter per locale+currency
// so rendering a table of many rows doesn't rebuild it per cell.
const _currencyFmt = new Map<string, Intl.NumberFormat>();

/** Format an amount in minor units (e.g. cents) as a currency string. Pass an
 * explicit `locale` on the server (from Accept-Language); omit it on the client
 * to use the browser locale. */
export function formatMinor(minor: number, currency: string, locale?: string): string {
  const key = `${locale ?? ''}|${currency}`;
  let fmt = _currencyFmt.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
    _currencyFmt.set(key, fmt);
  }
  return fmt.format(minor / 100);
}

/** Compact currency for large figures in dense UI (e.g. "$1.4M", "$185.7B"). */
export function formatMinorCompact(minor: number, currency: string, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(minor / 100);
}

const REGION_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });

/** Turn an ISO region code (e.g. "MY") into a country name ("Malaysia").
 * Falls back to the input if it isn't a known code. */
export function regionName(code: string): string {
  try {
    return REGION_NAMES.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** Sentence-case a snake/kebab token, e.g. "revenue_share" -> "Revenue share". */
export function humanize(token: string): string {
  const text = token.replaceAll(/[_-]/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Above this, a projected yield reads as a risk signal rather than "value
 * earned" — so we stop gilding it in gold (which the brand reserves for
 * plausible value). The underwriting memo already explains the risk; the
 * discovery surfaces just stop celebrating it. Tune as licensed data lands (M2). */
export const OUTLIER_YIELD_PCT = 25;
export const isOutlierYield = (pct: number): boolean => pct > OUTLIER_YIELD_PCT;
export const OUTLIER_YIELD_HINT = 'Unusually high yield — weigh against the risk tier';

/** Format an ISO date with a spelled-out month, e.g. "18 Aug 2024" — avoids the
 * ambiguity of numeric dates (06/07 = Jun 7 or Jul 6?). Locale-aware ordering. */
export function formatDate(iso: string, locale?: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
