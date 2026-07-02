'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

/** Register a deal on-chain (register_deal), signed by the program authority. */
export function RegisterDeal({ dealId }: { dealId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tx, setTx] = useState<string | null>(null);

  async function register(): Promise<void> {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/deal/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ dealId }),
      });
      const data = (await res.json()) as { error?: string; tx?: string };
      if (!res.ok) {
        setError(data.error ?? 'Registration failed.');
        return;
      }
      setTx(data.tx ?? null);
      router.refresh();
    } catch {
      setError('Couldn’t reach the server.');
    } finally {
      setBusy(false);
    }
  }

  if (tx) {
    return (
      <a
        href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-xs text-primary hover:underline"
      >
        registered ↗
      </a>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button size="sm" variant="outline" disabled={busy} onClick={register}>
        {busy ? 'Registering…' : 'Register on-chain'}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
