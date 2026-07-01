'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPositions, POSITIONS_CHANGED, type Position, removePosition } from '@/lib/positions';
import { cn, formatMinor, isOutlierYield, OUTLIER_YIELD_HINT } from '@/lib/utils';

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div
          className={cn(
            'mt-1 font-mono text-xl font-semibold tabular-nums',
            accent ? 'text-brand-gold' : 'text-foreground',
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="mt-6">
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <div
          aria-hidden
          className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="font-medium">No positions yet</p>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Discover a deal and express interest — your positions, projected yield, and risk
            concentration will show up here.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/app/deals" className={cn(buttonVariants(), 'h-10 px-4')}>
            Browse deals
          </Link>
          <Link href="/app" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}>
            Ask Copilot
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function PortfolioView() {
  // null = not yet read (avoid a flash of the empty state before localStorage loads)
  const [positions, setPositions] = useState<Position[] | null>(null);
  // Two-step confirm for the destructive Remove (no undo otherwise).
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const refresh = () => {
      // eslint-disable-next-line @eslint-react/set-state-in-effect
      setPositions(getPositions());
    };
    refresh();
    window.addEventListener(POSITIONS_CHANGED, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(POSITIONS_CHANGED, refresh);
      window.removeEventListener('storage', refresh);
      clearTimeout(confirmTimerRef.current);
    };
  }, []);

  if (positions === null) {
    return (
      <div className="mt-6 grid gap-3" aria-busy="true">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  if (positions.length === 0) return <EmptyState />;

  const currency = positions[0]?.currency ?? 'USD';
  const totalMinor = positions.reduce((s, p) => s + p.amountMinor, 0);
  const blended = positions.reduce((s, p) => s + p.amountMinor * p.projectedYieldPct, 0) / totalMinor;

  // Amount-weighted concentration by risk tier (only tiers actually held).
  const tierMeta = [
    { key: 'low' as const, label: 'Low', color: 'bg-emerald-500' },
    { key: 'medium' as const, label: 'Medium', color: 'bg-amber-500' },
    { key: 'high' as const, label: 'High', color: 'bg-rose-500' },
  ];
  const riskMix = tierMeta
    .map((t) => {
      const amt = positions.reduce((s, p) => (p.riskTier === t.key ? s + p.amountMinor : s), 0);
      return { ...t, pct: totalMinor ? (amt / totalMinor) * 100 : 0 };
    })
    .filter((t) => t.pct > 0);

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Invested" value={formatMinor(totalMinor, currency)} />
        <Stat label="Avg yield" value={`${blended.toFixed(1)}%`} accent={!isOutlierYield(blended)} />
        <Stat label="Positions" value={String(positions.length)} />
      </div>

      <div>
        <div className="mb-2 text-xs text-muted-foreground">Risk mix</div>
        <div aria-hidden className="flex h-2 overflow-hidden rounded-full bg-secondary">
          {riskMix.map((t) => (
            <div key={t.key} className={t.color} style={{ width: `${t.pct}%` }} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {riskMix.map((t) => (
            <span key={t.key} className="inline-flex items-center gap-1.5">
              <span aria-hidden className={cn('size-2 rounded-full', t.color)} />
              {t.label} {Math.round(t.pct)}%
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Positions
        </h2>
        <ul className="grid gap-3">
          {positions.map((p) => (
            <li key={p.id}>
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <Link
                      href={`/app/deals/${p.dealId}`}
                      className="rounded font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {p.dealTitle}
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-mono tabular-nums text-foreground">
                        {formatMinor(p.amountMinor, p.currency)}
                      </span>
                      <span
                        className={cn(
                          'font-mono tabular-nums',
                          isOutlierYield(p.projectedYieldPct) ? 'text-foreground' : 'text-brand-gold',
                        )}
                        title={isOutlierYield(p.projectedYieldPct) ? OUTLIER_YIELD_HINT : undefined}
                      >
                        {p.projectedYieldPct}%
                      </span>
                      <Badge variant={p.riskTier}>{p.riskTier}</Badge>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirmId === p.id) {
                        removePosition(p.id);
                        setConfirmId(null);
                      } else {
                        setConfirmId(p.id);
                        clearTimeout(confirmTimerRef.current);
                        confirmTimerRef.current = setTimeout(() => setConfirmId(null), 3000);
                      }
                    }}
                    aria-label={
                      confirmId === p.id ? `Confirm removing ${p.dealTitle}` : `Remove ${p.dealTitle}`
                    }
                    className={cn(
                      'inline-flex min-h-11 touch-manipulation items-center rounded px-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      confirmId === p.id
                        ? 'text-destructive'
                        : 'text-muted-foreground hover:text-destructive',
                    )}
                  >
                    {confirmId === p.id ? 'Confirm?' : 'Remove'}
                  </button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Recorded locally on this device — devnet, no funds moved.
        </p>
      </div>
    </div>
  );
}
