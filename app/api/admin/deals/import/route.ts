import { NextResponse } from 'next/server';

import { importCatalogue } from '@/lib/admin-api';
import { getAdminSession } from '@/lib/admin-auth';

export const maxDuration = 60;

/** Import a deal catalogue from an rwa.xyz asset-screener URL or an uploaded JSON
 * payload. Session-gated; forwards to the agents admin API which parses & activates
 * it as the override catalogue. */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { url?: string; payload?: unknown };
  try {
    body = (await request.json()) as { url?: string; payload?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body.url && body.payload === undefined) {
    return NextResponse.json({ error: 'Provide a URL or a JSON file.' }, { status: 400 });
  }

  let result: { status: number; data: unknown };
  try {
    result = await importCatalogue({ url: body.url, payload: body.payload });
  } catch {
    return NextResponse.json({ error: 'Couldn’t reach the agents service.' }, { status: 502 });
  }

  if (result.status !== 200) {
    const detail =
      (result.data as { detail?: string })?.detail ?? `Import failed (${result.status}).`;
    return NextResponse.json({ error: detail }, { status: result.status });
  }
  return NextResponse.json(result.data);
}
