import { NextResponse } from 'next/server';

import { resetCatalogue } from '@/lib/admin-api';
import { getAdminSession } from '@/lib/admin-auth';

/** Drop the imported catalogue override; deals fall back to the seed snapshot. */
export async function POST(): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json(await resetCatalogue());
  } catch {
    return NextResponse.json({ error: 'Couldn’t reach the agents service.' }, { status: 502 });
  }
}
