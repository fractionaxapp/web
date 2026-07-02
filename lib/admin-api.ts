/**
 * Server-only client for the agents service's admin endpoints. Attaches the shared
 * `ADMIN_API_KEY` (X-Admin-Key) and converts between the web's camelCase and the
 * service's snake_case. Import only from server components / route handlers that
 * have already passed the admin session check (`getAdminSession`).
 */
import type { ComplianceDecision, Investor, JurisdictionRule } from '@fractionax/domain';

import { deepCamel, deepSnake } from './case';

const AGENTS_URL = process.env.AGENTS_URL ?? 'http://localhost:8000';

export type CredentialStatus = 'none' | 'issued' | 'revoked';

export interface AdminInvestorRecord {
  investor: Investor;
  kycStatus: string;
  accreditationTier: string;
  credentialStatus: CredentialStatus;
  credentialTx: string | null;
  updatedAt: string;
}

function adminKey(): string {
  const key = process.env.ADMIN_API_KEY;
  if (!key) throw new Error('ADMIN_API_KEY is not set');
  return key;
}

async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${AGENTS_URL}${path}`, {
    ...init,
    cache: 'no-store',
    signal: AbortSignal.timeout(25_000),
    headers: {
      'content-type': 'application/json',
      'x-admin-key': adminKey(),
      ...(init?.headers ?? {}),
    },
  });
}

async function adminGet<T>(path: string): Promise<T> {
  const res = await adminFetch(path);
  if (!res.ok) throw new Error(`agents ${path} -> ${res.status}`);
  return deepCamel(await res.json()) as T;
}

export function listInvestors(): Promise<AdminInvestorRecord[]> {
  return adminGet<AdminInvestorRecord[]>('/admin/investors');
}

export function listDecisions(limit = 100): Promise<ComplianceDecision[]> {
  return adminGet<ComplianceDecision[]>(`/admin/decisions?limit=${limit}`);
}

export function listRules(): Promise<JurisdictionRule[]> {
  return adminGet<JurisdictionRule[]>('/compliance/rules');
}

export async function addInvestor(investor: Investor): Promise<AdminInvestorRecord> {
  const res = await adminFetch('/admin/investors', {
    method: 'POST',
    body: JSON.stringify(deepSnake(investor)),
  });
  if (!res.ok) throw new Error(`agents /admin/investors -> ${res.status}`);
  return deepCamel(await res.json()) as AdminInvestorRecord;
}

export interface CatalogueStatus {
  source: 'empty' | 'database';
  count: number;
  /** Total timeseries snapshot points captured across all imports. */
  snapshots: number;
}

export function catalogueStatus(): Promise<CatalogueStatus> {
  return adminGet<CatalogueStatus>('/admin/deals/catalogue');
}

/** Import a catalogue from a URL or an inline payload. Returns the agents
 * response status + body so the route can surface the exact error (e.g. 422 for a
 * bad payload). The payload is forwarded verbatim — it is rwa.xyz's own shape, not
 * our domain, so it is NOT case-converted. */
export async function importCatalogue(body: {
  url?: string;
  payload?: unknown;
}): Promise<{ status: number; data: unknown }> {
  const res = await adminFetch('/admin/deals/import', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => ({}));
  return { status: res.status, data: res.ok ? deepCamel(data) : data };
}

export async function resetCatalogue(): Promise<CatalogueStatus> {
  const res = await adminFetch('/admin/deals/reset', { method: 'POST' });
  if (!res.ok) throw new Error(`agents /admin/deals/reset -> ${res.status}`);
  return deepCamel(await res.json()) as CatalogueStatus;
}

export async function setCredentialStatus(
  investorId: string,
  status: CredentialStatus,
  tx: string | null,
  updatedAt: string,
): Promise<AdminInvestorRecord> {
  const res = await adminFetch(`/admin/investors/${encodeURIComponent(investorId)}/credential`, {
    method: 'POST',
    body: JSON.stringify(deepSnake({ status, tx, updatedAt })),
  });
  if (!res.ok) throw new Error(`agents credential update -> ${res.status}`);
  return deepCamel(await res.json()) as AdminInvestorRecord;
}
