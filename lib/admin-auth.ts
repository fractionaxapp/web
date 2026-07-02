/**
 * Server-only admin session layer. Importing `next/headers` makes this module
 * unusable from client components, so the secrets and crypto never reach the
 * browser bundle.
 *
 * Auth model (team allowlist): an admin logs in with an allowlisted email plus a
 * shared team access key; on success we issue an HMAC-signed session cookie
 * (`email.exp` payload, signed with `ADMIN_SESSION_SECRET`). The signer for
 * privileged on-chain writes is separate (the single program authority keypair) —
 * this layer only decides *who* may trigger those actions, and records which
 * admin did (the email is the audit identity).
 *
 * Env:
 *   ADMIN_EMAILS          comma-separated allowlist of admin emails
 *   ADMIN_ACCESS_KEY      shared team access key checked at login
 *   ADMIN_SESSION_SECRET  HMAC key for signing the session cookie
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'fx_admin';
const MAX_AGE_S = 60 * 60 * 8; // 8 hours

export interface AdminSession {
  email: string;
  /** Unix seconds. */
  exp: number;
}

function sessionSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set');
  return s;
}

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** True if the email is on the team allowlist. */
export function isAllowedEmail(email: string): boolean {
  return adminEmails().includes(email.trim().toLowerCase());
}

/** Constant-time comparison of the supplied access key against the configured one. */
export function checkAccessKey(key: string): boolean {
  const expected = process.env.ADMIN_ACCESS_KEY ?? '';
  if (!expected) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sign(payload: string): string {
  return createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
}

/** Build a signed cookie value for an authenticated admin. */
export function issueSession(email: string): { value: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_S;
  const payload = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), exp })).toString(
    'base64url',
  );
  return { value: `${payload}.${sign(payload)}`, maxAge: MAX_AGE_S };
}

/** Verify a cookie value: signature, expiry, and that the email is still allowlisted. */
export function verifySession(raw: string | undefined): AdminSession | null {
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot <= 0) return null;
  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as AdminSession;
    if (!parsed.email || !parsed.exp) return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    // Allowlist is authoritative at read time, so removing an email revokes access.
    if (!isAllowedEmail(parsed.email)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Read and verify the admin session from the request cookies (server components / routes). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySession(store.get(ADMIN_COOKIE)?.value);
}
