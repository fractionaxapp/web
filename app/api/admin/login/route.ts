import { NextResponse } from 'next/server';

import { ADMIN_COOKIE, checkAccessKey, isAllowedEmail, issueSession } from '@/lib/admin-auth';

/** Authenticate a team admin by allowlisted email + shared access key, and set a
 * signed session cookie. Failures return a single generic message so the response
 * doesn't reveal which of the two factors was wrong. */
export async function POST(request: Request): Promise<NextResponse> {
  let body: { email?: string; accessKey?: string };
  try {
    body = (await request.json()) as { email?: string; accessKey?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = body.email?.trim() ?? '';
  const accessKey = body.accessKey ?? '';
  if (!email || !accessKey) {
    return NextResponse.json({ error: 'Email and access key are required.' }, { status: 400 });
  }

  if (!isAllowedEmail(email) || !checkAccessKey(accessKey)) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const { value, maxAge } = issueSession(email);
  const res = NextResponse.json({ ok: true, email: email.toLowerCase() });
  res.cookies.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
  return res;
}
