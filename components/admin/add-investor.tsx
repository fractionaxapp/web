'use client';

import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const JURISDICTIONS = ['US', 'MY', 'SG', 'GB', 'AE', 'IR'] as const;

/** Manually add/screen an investor into the directory. Screens KYC/AML +
 * accreditation (no deal context) and refreshes the server-rendered table. */
export function AddInvestor() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [jurisdiction, setJurisdiction] = useState<string>('MY');
  const [accredited, setAccredited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fieldId = useId();

  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/investors', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, displayName, jurisdiction, accredited, riskAppetite: 'medium' }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Couldn’t add the investor.');
        return;
      }
      setOpen(false);
      setId('');
      setDisplayName('');
      setAccredited(false);
      router.refresh();
    } catch {
      setError('Couldn’t reach the server.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        Add investor
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <div>
        <label htmlFor={`${fieldId}-id`} className="text-xs font-medium text-muted-foreground">
          Investor ID
        </label>
        <Input
          id={`${fieldId}-id`}
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="inv_alex"
          className="mt-1 w-36"
          required
        />
      </div>
      <div>
        <label htmlFor={`${fieldId}-name`} className="text-xs font-medium text-muted-foreground">
          Name
        </label>
        <Input
          id={`${fieldId}-name`}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Alex Tan"
          className="mt-1 w-40"
          required
        />
      </div>
      <div>
        <label htmlFor={`${fieldId}-jur`} className="text-xs font-medium text-muted-foreground">
          Jurisdiction
        </label>
        <select
          id={`${fieldId}-jur`}
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          className="mt-1 block h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {JURISDICTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <label className="flex h-10 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={accredited}
          onChange={(e) => setAccredited(e.target.checked)}
          className="size-4 rounded border-input"
        />
        Accredited
      </label>
      <Button type="submit" disabled={loading} size="sm">
        {loading ? 'Screening…' : 'Screen & add'}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      {error && (
        <p role="alert" className="w-full text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
