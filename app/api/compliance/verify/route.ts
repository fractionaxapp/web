import { NextResponse } from 'next/server';

import { deepCamel, deepSnake } from '@/lib/case';

const AGENTS_URL = process.env.AGENTS_URL ?? 'http://localhost:8000';

/**
 * Proxy the Compliance Agent's eligibility check. The client posts a camelCase
 * `{ investor, dealId }`; we snake_case it for the agents service and camelCase
 * the `ComplianceDecision` back. The decision is deterministic server-side, so
 * this works even with no LLM key configured.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as {
    investor?: Record<string, unknown>;
    dealId?: string;
  };
  if (!body.investor || !body.dealId) {
    return NextResponse.json({ error: 'investor and dealId are required' }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${AGENTS_URL}/compliance/verify`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(deepSnake({ investor: body.investor, dealId: body.dealId })),
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    return NextResponse.json({ error: 'Agents service unreachable' }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: `Agents service error (${res.status})` },
      { status: res.status },
    );
  }
  return NextResponse.json(deepCamel(await res.json()));
}
