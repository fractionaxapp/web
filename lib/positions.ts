import type { Deal } from '@fractionax/domain';

/** A recorded investment intent — the "you approve" step. Persisted locally
 * (devnet has no settlement backend); the portfolio reads these as positions. */
export interface Position {
  id: string;
  dealId: string;
  dealTitle: string;
  amountMinor: number;
  currency: string;
  projectedYieldPct: number;
  riskTier: Deal['riskTier'];
  createdAt: number;
}

const KEY = 'fractionax:positions';
/** Fired on the window whenever positions change, so open views can refresh. */
export const POSITIONS_CHANGED = 'positions:changed';

function read(): Position[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Position[]) : [];
  } catch {
    return [];
  }
}

function write(list: Position[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(POSITIONS_CHANGED));
  } catch {
    /* storage unavailable */
  }
}

export function getPositions(): Position[] {
  return read();
}

export function addPosition(p: Omit<Position, 'id' | 'createdAt'>): void {
  const createdAt = Date.now();
  const id = `${p.dealId}-${createdAt}-${Math.random().toString(36).slice(2, 7)}`;
  write([{ ...p, id, createdAt }, ...read()]);
}

export function removePosition(id: string): void {
  write(read().filter((p) => p.id !== id));
}
