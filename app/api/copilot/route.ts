import { NextResponse } from 'next/server';

import { deepCamel } from '@/lib/case';

const AGENTS_URL = process.env.AGENTS_URL ?? 'http://localhost:8000';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as { message?: string; withMemo?: boolean };
  if (!body.message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${AGENTS_URL}/copilot`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: body.message, with_memo: body.withMemo ?? true }),
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
