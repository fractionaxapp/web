'use client';

import type { ComplianceDecision, Deal } from '@fractionax/domain';
import { useId, useState } from 'react';

import { ExpressInterest } from '@/components/express-interest';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn, regionName } from '@/lib/utils';

/** Jurisdictions offered in the demo profile — chosen to exercise every rule
 * branch: US (Reg D / blocked from Reg S), MY/SG (offshore retail), IR (sanctioned). */
const JURISDICTIONS = ['US', 'MY', 'SG', 'GB', 'AE', 'IR'] as const;

const REGIME_LABEL: Record<string, string> = {
  reg_d: 'Reg D · US private placement',
  reg_s: 'Reg S · offshore offering',
  reg_a: 'Reg A · retail offering',
};

/**
 * The compliance-gated invest flow (M3). The investor supplies a minimal profile;
 * the Compliance Agent screens it (KYC/AML + jurisdiction + accreditation) and
 * returns an authoritative allow/deny. Only on `allow` is the invest CTA revealed —
 * the same gate the on-chain `assert_compliant` instruction enforces.
 */
export function InvestPanel({ deal, locale }: { deal: Deal; locale?: string }) {
  const [jurisdiction, setJurisdiction] = useState<string>(deal.jurisdiction);
  const [accredited, setAccredited] = useState(false);
  const [decision, setDecision] = useState<ComplianceDecision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jurisdictionId = useId();

  async function check(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDecision(null);
    try {
      const res = await fetch('/api/compliance/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          investor: {
            id: 'inv_local',
            displayName: 'You',
            jurisdiction,
            accredited,
            riskAppetite: 'medium',
          },
          dealId: deal.id,
        }),
      });
      const data = (await res.json()) as ComplianceDecision & { error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? 'Couldn’t run the eligibility check. Try again.');
        return;
      }
      setDecision(data);
    } catch {
      setError('Couldn’t reach the compliance agent. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  const allowed = decision?.outcome === 'allow';

  return (
    <div className="rounded-lg border p-4">
      <form onSubmit={check} className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor={jurisdictionId} className="text-sm font-medium">
            Your jurisdiction
          </label>
          <select
            id={jurisdictionId}
            value={jurisdiction}
            onChange={(e) => {
              setJurisdiction(e.target.value);
              setDecision(null);
            }}
            className="mt-1 block h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {JURISDICTIONS.map((code) => (
              <option key={code} value={code}>
                {regionName(code)} ({code})
              </option>
            ))}
          </select>
        </div>
        <label className="flex h-10 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={accredited}
            onChange={(e) => {
              setAccredited(e.target.checked);
              setDecision(null);
            }}
            className="size-4 rounded border-input"
          />
          Accredited investor
        </label>
        <Button type="submit" disabled={loading} className="h-10 px-4">
          {loading ? (
            <>
              <Spinner className="mr-2 size-4" /> Checking…
            </>
          ) : (
            'Check eligibility'
          )}
        </Button>
      </form>

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {decision && (
        <div
          role="status"
          className={cn(
            'mt-4 rounded-lg border p-4 text-sm',
            allowed
              ? 'border-primary/30 bg-primary/5'
              : 'border-destructive/30 bg-destructive/5',
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">
              {allowed ? 'Eligible to invest' : 'Not eligible'}
            </span>
            <Badge variant="outline">{REGIME_LABEL[decision.regime] ?? decision.regime}</Badge>
            <Badge variant={allowed ? 'low' : 'high'}>{decision.accreditationTier}</Badge>
          </div>
          <p className="mt-2 text-muted-foreground">{decision.rationale}</p>
          {!allowed && decision.reasons.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {decision.reasons.map((r) => (
                <li key={r.code}>{r.detail}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {allowed && (
        <div className="mt-4">
          <ExpressInterest deal={deal} locale={locale} />
        </div>
      )}
    </div>
  );
}
