'use client';

import type { Deal } from '@fractionax/domain';
import Link from 'next/link';
import { useId, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { addPosition } from '@/lib/positions';
import { cn, formatMinor } from '@/lib/utils';

/** The "you approve" step: record an investment intent for a deal. On devnet
 * this persists locally and shows up in the portfolio — no funds move. */
export function ExpressInterest({ deal, locale }: { deal: Deal; locale?: string }) {
  const minMajor = deal.minInvestmentMinor / 100;
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(minMajor));
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldId = useId();
  const errorId = useId();

  function confirm(e: React.FormEvent): void {
    e.preventDefault();
    const value = Number(amount.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter an amount greater than zero.');
      inputRef.current?.focus();
      return;
    }
    if (value * 100 < deal.minInvestmentMinor) {
      setError(`The minimum for this deal is ${formatMinor(deal.minInvestmentMinor, deal.currency, locale)}.`);
      inputRef.current?.focus();
      return;
    }
    addPosition({
      dealId: deal.id,
      dealTitle: deal.title,
      amountMinor: Math.round(value * 100),
      currency: deal.currency,
      projectedYieldPct: deal.projectedYieldPct,
      riskTier: deal.riskTier,
    });
    setDone(true);
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm"
      >
        <p className="font-medium">Interest recorded.</p>
        <p className="mt-1 text-muted-foreground">
          We’ll prepare this intent for your approval. It’s now in your portfolio (devnet — no funds
          moved).
        </p>
        <Link
          href="/app/portfolio"
          className="mt-3 inline-flex rounded text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View portfolio →
        </Link>
      </div>
    );
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="h-10 px-4">
        Express interest
      </Button>
    );
  }

  return (
    <form onSubmit={confirm} className="rounded-lg border p-4">
      <label htmlFor={fieldId} className="text-sm font-medium">
        How much would you like to invest?
      </label>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex items-center rounded-md border border-input bg-background pl-3 focus-within:ring-2 focus-within:ring-ring">
          <span className="text-sm text-muted-foreground" aria-hidden>
            {deal.currency === 'USD' ? '$' : ''}
          </span>
          <input
            id={fieldId}
            ref={inputRef}
            name="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder={String(minMajor)}
            className="w-32 bg-transparent px-2 py-2 text-base focus:outline-none sm:text-sm"
          />
        </div>
        <Button type="submit" className="h-10 px-4">
          Confirm interest
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="h-10 px-3"
        >
          Cancel
        </Button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p className={cn('mt-2 text-xs text-muted-foreground')}>
          Minimum {formatMinor(deal.minInvestmentMinor, deal.currency, locale)} · devnet, no funds
          move.
        </p>
      )}
    </form>
  );
}
