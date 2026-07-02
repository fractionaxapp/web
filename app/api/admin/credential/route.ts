import { issueCredential, revokeCredential } from '@fractionax/solana/admin';
import { NextResponse } from 'next/server';

import { listInvestors, setCredentialStatus } from '@/lib/admin-api';
import { getAdminSession } from '@/lib/admin-auth';

export const maxDuration = 60;

/** Issue or revoke an investor's on-chain credential, signed by the program
 * authority, then mirror the result into the admin store. Session-gated. */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { investorId?: string; action?: 'issue' | 'revoke' };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const { investorId, action } = body;
  if (!investorId || (action !== 'issue' && action !== 'revoke')) {
    return NextResponse.json({ error: 'investorId and action (issue|revoke) required.' }, { status: 400 });
  }

  // Look up the investor's profile (jurisdiction/accreditation/KYC) from the store.
  let record;
  try {
    const investors = await listInvestors();
    record = investors.find((r) => r.investor.id === investorId);
  } catch {
    return NextResponse.json({ error: 'Couldn’t reach the agents service.' }, { status: 502 });
  }
  if (!record) return NextResponse.json({ error: 'Unknown investor.' }, { status: 404 });

  if (action === 'issue' && record.kycStatus !== 'verified') {
    return NextResponse.json({ error: 'KYC must be verified before issuing a credential.' }, { status: 409 });
  }

  let result: { tx: string; wallet: string };
  try {
    if (action === 'issue') {
      result = await issueCredential({
        investorId,
        wallet: record.investor.wallet,
        jurisdiction: record.investor.jurisdiction,
        accredited: Boolean(record.investor.accredited),
        kycVerified: true,
        sanctionsClear: true,
      });
    } else {
      result = await revokeCredential({ investorId, wallet: record.investor.wallet });
    }
  } catch (e) {
    const detail = e instanceof Error ? e.message : 'on-chain transaction failed';
    return NextResponse.json({ error: `On-chain ${action} failed: ${detail}` }, { status: 502 });
  }

  // Mirror the on-chain state into the store (best-effort; the chain is authoritative).
  try {
    await setCredentialStatus(
      investorId,
      action === 'issue' ? 'issued' : 'revoked',
      result.tx,
      new Date().toISOString(),
    );
  } catch {
    // The transaction already confirmed; surface it even if the mirror write failed.
  }

  return NextResponse.json({ ok: true, tx: result.tx, wallet: result.wallet });
}
