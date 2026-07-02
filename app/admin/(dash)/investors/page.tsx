import { AddInvestor } from '@/components/admin/add-investor';
import { CredentialActions } from '@/components/admin/credential-actions';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { type AdminInvestorRecord, listInvestors } from '@/lib/admin-api';
import { regionName } from '@/lib/utils';

export const metadata = { title: 'Admin · Investors' };
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function kycVariant(status: string): 'low' | 'medium' | 'high' {
  if (status === 'verified') return 'low';
  if (status === 'rejected') return 'high';
  return 'medium';
}

function credVariant(status: string): 'low' | 'medium' | 'high' {
  if (status === 'issued') return 'low';
  if (status === 'revoked') return 'high';
  return 'medium';
}

export default async function AdminInvestorsPage() {
  let records: AdminInvestorRecord[] = [];
  let error: string | null = null;
  try {
    records = await listInvestors();
  } catch {
    error = 'Couldn’t load the investor directory from the agents service.';
  }

  return (
    <main id="main" className="px-safe mx-auto max-w-6xl py-10">
      <PageHeader
        kicker="Super admin"
        title="Investor directory"
        description="Everyone screened by the Compliance Agent, with KYC status, accreditation tier, and on-chain credential state."
        action={<AddInvestor />}
      />

      {error && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {error}
        </p>
      )}

      {!error && records.length === 0 && (
        <Card className="mt-6">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No investors yet. They appear here after an eligibility check, or add one above.
          </CardContent>
        </Card>
      )}

      {records.length > 0 && (
        <Card className="mt-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Investor</th>
                    <th className="px-4 py-3 font-medium">Jurisdiction</th>
                    <th className="px-4 py-3 font-medium">KYC</th>
                    <th className="px-4 py-3 font-medium">Tier</th>
                    <th className="px-4 py-3 font-medium">On-chain credential</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {records.map((r) => (
                    <tr key={r.investor.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.investor.displayName}</div>
                        <div className="font-mono text-xs text-muted-foreground">{r.investor.id}</div>
                      </td>
                      <td className="px-4 py-3">{regionName(r.investor.jurisdiction)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={kycVariant(r.kycStatus)}>{r.kycStatus}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{r.accreditationTier}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={credVariant(r.credentialStatus)}>{r.credentialStatus}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <CredentialActions
                          investorId={r.investor.id}
                          jurisdiction={r.investor.jurisdiction}
                          accredited={r.investor.accredited}
                          kycStatus={r.kycStatus}
                          credentialStatus={r.credentialStatus}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Issuing a credential writes the investor’s KYC/jurisdiction/accreditation to the on-chain
        credential PDA, signed by the program authority. Devnet — no real funds move.
      </p>
    </main>
  );
}
