import { Deal } from '@fractionax/domain';
import { z } from 'zod';

import { deepCamel } from './case';

const Deals = z.array(Deal);
const AGENTS_URL = process.env.AGENTS_URL ?? 'http://localhost:8000';

/** Fetch deals live from the agents service, failing gracefully (never a 504). */
export async function fetchDeals(
  riskTier?: string,
): Promise<{ deals: Deal[]; error: string | null }> {
  try {
    const qs = riskTier ? `?risk_tier=${riskTier}` : '';
    const res = await fetch(`${AGENTS_URL}/deals${qs}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) return { deals: [], error: 'Couldn’t load deals right now. Try again in a moment.' };
    const parsed = Deals.safeParse(deepCamel(await res.json()));
    if (!parsed.success) return { deals: [], error: 'Couldn’t read the deals response. Try again.' };
    return { deals: parsed.data, error: null };
  } catch (e) {
    const waking = e instanceof Error && e.name === 'TimeoutError';
    return {
      deals: [],
      error: waking
        ? 'The agents are waking up — give it a few seconds, then try again.'
        : 'Couldn’t reach the agents. Check your connection and try again.',
    };
  }
}

/** Look up a single deal by id from the live list. */
export async function fetchDeal(id: string): Promise<{ deal: Deal | null; error: string | null }> {
  const { deals, error } = await fetchDeals();
  if (error) return { deal: null, error };
  return { deal: deals.find((d) => d.id === id) ?? null, error: null };
}
