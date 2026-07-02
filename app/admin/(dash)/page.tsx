import {
  DEFAULT_CLUSTER,
  FRACTIONAX_PROGRAM_ID,
  fetchRegistry,
  getConnection,
  getRegistryPda,
  type Registry,
} from '@fractionax/solana';

import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = { title: 'Admin · Overview' };
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const PLACEHOLDER_ID = '11111111111111111111111111111111';
const AGENTS_URL = process.env.AGENTS_URL ?? 'http://localhost:8000';

const explorerUrl = (address: string) =>
  `https://explorer.solana.com/address/${address}?cluster=${DEFAULT_CLUSTER}`;

async function agentsHealthy(): Promise<boolean> {
  try {
    const res = await fetch(`${AGENTS_URL}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}

export default async function AdminOverviewPage() {
  const programId = FRACTIONAX_PROGRAM_ID;
  const [registryPda] = getRegistryPda(programId);
  const deployed = programId.toBase58() !== PLACEHOLDER_ID;

  let registry: Registry | null = null;
  let chainError: string | null = null;
  if (deployed) {
    try {
      registry = await fetchRegistry(getConnection(DEFAULT_CLUSTER), programId);
    } catch (e) {
      chainError = e instanceof Error ? e.message : 'Failed to read the chain.';
    }
  }

  const healthy = await agentsHealthy();

  return (
    <main id="main" className="px-safe mx-auto max-w-5xl py-10">
      <PageHeader
        kicker="Super admin"
        title="Overview"
        description={`Platform control plane — program registry and services, live from ${DEFAULT_CLUSTER}.`}
        action={
          <Badge variant="secondary" className="uppercase">
            {DEFAULT_CLUSTER}
          </Badge>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Deals on-chain"
          value={registry ? registry.dealCount.toString() : '—'}
          sub="registered via register_deal"
        />
        <Metric
          label="Agents service"
          value={healthy ? 'Healthy' : 'Down'}
          sub={healthy ? AGENTS_URL : 'unreachable'}
        />
        <Metric
          label="Program"
          value={deployed ? 'Deployed' : 'Not set'}
          sub={deployed ? 'devnet' : 'FRACTIONAX_PROGRAM_ID unset'}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Program registry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Program ID" value={programId.toBase58()} href={deployed ? explorerUrl(programId.toBase58()) : undefined} />
          <Row label="Registry PDA" value={registryPda.toBase58()} href={explorerUrl(registryPda.toBase58())} />
          {registry ? (
            <Row
              label="Authority (super-admin key)"
              value={registry.authority.toBase58()}
              href={explorerUrl(registry.authority.toBase58())}
            />
          ) : (
            <p className="text-muted-foreground">
              {chainError
                ? 'Couldn’t read the registry right now.'
                : deployed
                  ? 'Registry not initialized yet.'
                  : 'Program not deployed.'}
            </p>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">
        On-chain writes are authorized by the single program authority key above; admin actions
        are attributed to the signed-in team member. Devnet — no real funds move.
      </p>
    </main>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all rounded font-mono text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {value}
        </a>
      ) : (
        <span className="break-all font-mono text-xs">{value}</span>
      )}
    </div>
  );
}
