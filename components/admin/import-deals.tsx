'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MAX_FILE_BYTES = 48 * 1024 * 1024; // 48 MB guard for the uploaded JSON

/** Import a fresh deal catalogue from an rwa.xyz asset-screener export — either a
 * URL (fetched server-side) or an uploaded .json file (parsed client-side and sent
 * as a payload). Shows whether the live catalogue is the seed or an import. */
export function ImportDeals({
  source,
  count,
  snapshots,
}: {
  source: 'empty' | 'database';
  count: number;
  snapshots: number;
}) {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState<null | 'url' | 'file' | 'reset'>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function post(body: unknown, mode: 'url' | 'file'): Promise<void> {
    setBusy(mode);
    setError(null);
    setOk(null);
    try {
      const res = await fetch('/api/admin/deals/import', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string; imported?: number; source?: string };
      if (!res.ok) {
        setError(data.error ?? 'Import failed.');
        return;
      }
      setOk(`Imported ${data.imported} deals into the database.`);
      setUrl('');
      if (fileRef.current) fileRef.current.value = '';
      router.refresh();
    } catch {
      setError('Couldn’t reach the server.');
    } finally {
      setBusy(null);
    }
  }

  function importUrl(e: React.FormEvent): void {
    e.preventDefault();
    if (!url.trim()) return;
    void post({ url: url.trim() }, 'url');
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setOk(null);
    if (file.size > MAX_FILE_BYTES) {
      setError('File is too large (max 48 MB).');
      return;
    }
    let payload: unknown;
    try {
      payload = JSON.parse(await file.text());
    } catch {
      setError('That file isn’t valid JSON.');
      return;
    }
    void post({ payload }, 'file');
  }

  async function reset(): Promise<void> {
    setBusy('reset');
    setError(null);
    setOk(null);
    try {
      const res = await fetch('/api/admin/deals/reset', { method: 'POST' });
      if (!res.ok) {
        setError('Reset failed.');
        return;
      }
      setOk('Cleared the catalogue.');
      router.refresh();
    } catch {
      setError('Couldn’t reach the server.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Update catalogue data
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant={source === 'database' ? 'low' : 'secondary'}>
            {source === 'database' ? `database · ${count} deals` : 'empty'}
          </Badge>
          {snapshots > 0 && <Badge variant="outline">{snapshots} snapshots</Badge>}
          {source === 'database' && (
            <Button size="sm" variant="ghost" disabled={busy !== null} onClick={reset}>
              {busy === 'reset' ? 'Clearing…' : 'Clear catalogue'}
            </Button>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Paste an rwa.xyz asset-screener link, or upload its <code className="font-mono">.json</code>{' '}
        export. Both replace the live deal catalogue.
      </p>

      <form onSubmit={importUrl} className="mt-3 flex flex-wrap items-center gap-2">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://app.rwa.xyz/_next/data/…/asset-screener.json"
          className="min-w-0 flex-1"
        />
        <Button type="submit" disabled={busy !== null || !url.trim()} size="sm">
          {busy === 'url' ? 'Importing…' : 'Import from URL'}
        </Button>
      </form>

      <div className="mt-2 flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={onFile}
          disabled={busy !== null}
          className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-accent"
        />
        {busy === 'file' && <span className="text-xs text-muted-foreground">Importing…</span>}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {ok && (
        <p role="status" className="mt-3 text-sm text-primary">
          {ok}
        </p>
      )}
    </div>
  );
}
