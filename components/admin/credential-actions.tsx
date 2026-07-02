'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type CredentialStatus = 'none' | 'issued' | 'revoked';

/** Issue or revoke an investor's on-chain credential. The action is signed
 * server-side by the program authority; on success the store mirror is updated and
 * the table refreshes. Issue requires a verified KYC status. */
export function CredentialActions({
  investorId,
  kycStatus,
  credentialStatus,
}: {
  investorId: string;
  jurisdiction: string;
  accredited: boolean;
  kycStatus: string;
  credentialStatus: CredentialStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | 'issue' | 'revoke'>(null);
  const [error, setError] = useState<string | null>(null);
  const [tx, setTx] = useState<string | null>(null);

  async function run(action: 'issue' | 'revoke'): Promise<void> {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch('/api/admin/credential', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ investorId, action }),
      });
      const data = (await res.json()) as { error?: string; tx?: string };
      if (!res.ok) {
        setError(data.error ?? 'Action failed.');
        return;
      }
      setTx(data.tx ?? null);
      router.refresh();
    } catch {
      setError('Couldn’t reach the server.');
    } finally {
      setBusy(null);
    }
  }

  const canIssue = kycStatus === 'verified' && credentialStatus !== 'issued';
  const canRevoke = credentialStatus === 'issued';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!canIssue || busy !== null}
          onClick={() => run('issue')}
          title={kycStatus === 'verified' ? undefined : 'KYC must be verified first'}
        >
          {busy === 'issue' ? 'Issuing…' : credentialStatus === 'revoked' ? 'Re-issue' : 'Issue'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={!canRevoke || busy !== null}
          onClick={() => run('revoke')}
        >
          {busy === 'revoke' ? 'Revoking…' : 'Revoke'}
        </Button>
      </div>
      {tx && (
        <a
          href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-[16ch] truncate font-mono text-xs text-primary hover:underline"
          title={tx}
        >
          {tx}
        </a>
      )}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
