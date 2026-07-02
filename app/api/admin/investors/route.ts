import { NextResponse } from 'next/server';

import { addInvestor } from '@/lib/admin-api';
import { getAdminSession } from '@/lib/admin-auth';

/** Add/screen an investor into the directory. Session-gated (team admin), then
 * proxied to the agents admin API with the shared key. */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    id?: string;
    displayName?: string;
    jurisdiction?: string;
    accredited?: boolean;
    riskAppetite?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const id = body.id?.trim();
  const displayName = body.displayName?.trim();
  const jurisdiction = body.jurisdiction?.trim().toUpperCase();
  if (!id || !displayName || !jurisdiction || jurisdiction.length !== 2) {
    return NextResponse.json(
      { error: 'id, displayName and a 2-letter jurisdiction are required.' },
      { status: 400 },
    );
  }

  try {
    const record = await addInvestor({
      id,
      displayName,
      jurisdiction,
      accredited: Boolean(body.accredited),
      riskAppetite: (body.riskAppetite as 'low' | 'medium' | 'high') ?? 'medium',
      kycStatus: 'unverified',
    });
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: 'Couldn’t reach the agents service.' }, { status: 502 });
  }
}
