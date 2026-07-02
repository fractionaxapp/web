import type { ComplianceDecision, JurisdictionRule } from '@fractionax/domain';

import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listDecisions, listRules } from '@/lib/admin-api';

export const metadata = { title: 'Admin · Compliance' };
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const REGIME_LABEL: Record<string, string> = {
  reg_d: 'Reg D',
  reg_s: 'Reg S',
  reg_a: 'Reg A',
};

export default async function AdminCompliancePage() {
  let rules: JurisdictionRule[] = [];
  let decisions: ComplianceDecision[] = [];
  let error: string | null = null;
  try {
    [rules, decisions] = await Promise.all([listRules(), listDecisions(50)]);
  } catch {
    error = 'Couldn’t load compliance data from the agents service.';
  }

  return (
    <main id="main" className="px-safe mx-auto max-w-6xl py-10">
      <PageHeader
        kicker="Super admin"
        title="Compliance"
        description="The jurisdiction rules engine and a live log of eligibility decisions."
      />

      {error && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {error}
        </p>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Jurisdiction rules engine</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Regime</th>
                  <th className="px-4 py-3 font-medium">Allowed</th>
                  <th className="px-4 py-3 font-medium">Blocked</th>
                  <th className="px-4 py-3 font-medium">Min tier</th>
                  <th className="px-4 py-3 font-medium">Accredited-only risk</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rules.map((r) => (
                  <tr key={r.regime}>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{REGIME_LABEL[r.regime] ?? r.regime}</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {r.allowedJurisdictions.length ? r.allowedJurisdictions.join(', ') : 'any not blocked'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {r.blockedJurisdictions.length ? r.blockedJurisdictions.join(', ') : '—'}
                    </td>
                    <td className="px-4 py-3">{r.minTier}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {r.accreditedOnlyRiskTiers.length ? r.accreditedOnlyRiskTiers.join(', ') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <h2 className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Recent decisions
      </h2>
      {decisions.length === 0 && !error ? (
        <Card className="mt-3">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No decisions logged yet. They appear here as investors run eligibility checks.
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-3">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Investor</th>
                    <th className="px-4 py-3 font-medium">Deal</th>
                    <th className="px-4 py-3 font-medium">Regime</th>
                    <th className="px-4 py-3 font-medium">Outcome</th>
                    <th className="px-4 py-3 font-medium">Reasons</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {decisions.map((d) => (
                    <tr key={`${d.investorId}-${d.dealId}-${d.decidedAt}`}>
                      <td className="px-4 py-3 font-mono text-xs">{d.investorId}</td>
                      <td className="px-4 py-3 font-mono text-xs">{d.dealId}</td>
                      <td className="px-4 py-3">{REGIME_LABEL[d.regime] ?? d.regime}</td>
                      <td className="px-4 py-3">
                        <Badge variant={d.outcome === 'allow' ? 'low' : 'high'}>{d.outcome}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {d.reasons.length ? d.reasons.map((r) => r.code).join(', ') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
