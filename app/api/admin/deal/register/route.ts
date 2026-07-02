import { registerDeal } from '@fractionax/solana/admin';
import { NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/admin-auth';

export const maxDuration = 60;

/** Register a deal on-chain (register_deal), signed by the program authority.
 * Session-gated. */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { dealId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const dealId = body.dealId?.trim();
  if (!dealId) return NextResponse.json({ error: 'dealId is required.' }, { status: 400 });
  if (dealId.length > 64) {
    return NextResponse.json({ error: 'dealId must be at most 64 characters.' }, { status: 400 });
  }

  try {
    const tx = await registerDeal(dealId);
    return NextResponse.json({ ok: true, tx });
  } catch (e) {
    const detail = e instanceof Error ? e.message : 'on-chain transaction failed';
    return NextResponse.json({ error: `On-chain register failed: ${detail}` }, { status: 502 });
  }
}
