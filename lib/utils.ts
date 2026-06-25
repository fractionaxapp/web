import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names, resolving conflicts (shadcn convention). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format an amount in minor units (e.g. cents) as a currency string. Pass an
 * explicit `locale` on the server (from Accept-Language); omit it on the client
 * to use the browser locale. */
export function formatMinor(minor: number, currency: string, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
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
