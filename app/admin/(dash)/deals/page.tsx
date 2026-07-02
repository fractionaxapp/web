import {
  DEFAULT_CLUSTER,
  FRACTIONAX_PROGRAM_ID,
  fetchRegistry,
  getConnection,
  getRegistryPda,
} from '@fractionax/solana';

import { ImportDeals } from '@/components/admin/import-deals';
import { RegisterRows } from '@/components/admin/register-rows';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { type CatalogueStatus, catalogueStatus } from '@/lib/admin-api';
import { fetchDeals } from '@/lib/deals';
import { formatMinor, regionName } from '@/lib/utils';

export const metadata = { title: 'Admin · Deals' };
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

async function readDealCount(): Promise<bigint | null> {
  try {
    const registry = await fetchRegistry(getConnection(DEFAULT_CLUSTER), FRACTIONAX_PROGRAM_ID);
    return registry?.dealCount ?? null;
  } catch {
    return null;
  }
}

async function readCatalogueStatus(): Promise<CatalogueStatus> {
  try {
    return await catalogueStatus();
  } catch {
    return { source: 'empty', count: 0, snapshots: 0 };
  }
}

const ROW_LIMIT = 40;

export default async function AdminDealsPage() {
  // Fetch in parallel, and pull only the rows we render — the total comes from the
  // catalogue status (served from the agents' in-memory cache, not a DB query).
  const [{ deals, error }, dealCount, catalogue] = await Promise.all([
    fetchDeals(undefined, ROW_LIMIT),
    readDealCount(),
    readCatalogueStatus(),
  ]);
  const [registryPda] = getRegistryPda(FRACTIONAX_PROGRAM_ID);

  return (
    <main id="main" className="px-safe mx-auto max-w-6xl py-10">
      <PageHeader
        kicker="Super admin"
        title="Deals"
        description="Curate the sourced catalogue and register deals on-chain via the program authority."
        action={
          <Badge variant="secondary" className="uppercase">
            {dealCount !== null ? `${dealCount} on-chain` : DEFAULT_CLUSTER}
          </Badge>
        }
      />

      {error && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-6">
        <ImportDeals
          source={catalogue.source}
          count={catalogue.count}
          snapshots={catalogue.snapshots}
        />
      </div>

      <p className="mt-4 break-all font-mono text-xs text-muted-foreground">
        Registry PDA {registryPda.toBase58()}
      </p>

      {deals.length > 0 && (
        <Card className="mt-4 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Deal</th>
                    <th className="px-4 py-3 font-medium">Jurisdiction</th>
                    <th className="px-4 py-3 font-medium">Risk</th>
                    <th className="px-4 py-3 font-medium">Min</th>
                    <th className="px-4 py-3 font-medium">On-chain</th>
                  </tr>
                </thead>
                <RegisterRows>
                  {deals.map((d) => (
                    <tr key={d.id}>
                      <td className="px-4 py-3">
                        <div className="max-w-[28ch] truncate font-medium" title={d.title}>
                          {d.title}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">{d.id}</div>
                      </td>
                      <td className="px-4 py-3">{regionName(d.jurisdiction)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={d.riskTier}>{d.riskTier}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs tabular-nums">
                        {formatMinor(d.minInvestmentMinor, d.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          data-deal-id={d.id}
                          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                          Register on-chain
                        </button>
                      </td>
                    </tr>
                  ))}
                </RegisterRows>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Showing up to {ROW_LIMIT} of {catalogue.count} deals. Registering increments the on-chain
        deal counter (metadata stays off-chain until tokenization). Devnet — no real funds move.
      </p>
    </main>
  );
}
