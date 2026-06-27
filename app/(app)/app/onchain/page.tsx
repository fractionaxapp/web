import {
  DEFAULT_CLUSTER,
  FRACTIONAX_PROGRAM_ID,
  fetchRegistry,
  getConnection,
  getRegistryPda,
  type Registry,
} from '@fractionax/solana';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = { title: 'On-chain' };

// Always read live chain state.
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// The default program id (System Program) means "not deployed yet".
const PLACEHOLDER_ID = '11111111111111111111111111111111';

// Explorer URL with the active cluster baked in, so devnet links stay on devnet.
const explorerUrl = (address: string) =>
  `https://explorer.solana.com/address/${address}?cluster=${DEFAULT_CLUSTER}`;

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} — view on Solana Explorer`}
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

export default async function OnchainPage() {
  const programId = FRACTIONAX_PROGRAM_ID;
  const [registryPda] = getRegistryPda(programId);
  const deployed = programId.toBase58() !== PLACEHOLDER_ID;

  let registry: Registry | null = null;
  let error: string | null = null;
  if (deployed) {
    try {
      registry = await fetchRegistry(getConnection(DEFAULT_CLUSTER), programId);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to read the chain.';
    }
  }

  return (
    <main id="main" className="px-safe max-w-3xl py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">On-chain</h1>
        <Badge variant="secondary" className="uppercase">
          {DEFAULT_CLUSTER}
        </Badge>
      </div>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        The Fractionax Solana program and its registry, read live from {DEFAULT_CLUSTER}.
      </p>

      <h2 className="sr-only">Program details</h2>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row
            label="Program ID"
            value={programId.toBase58()}
            href={deployed ? explorerUrl(programId.toBase58()) : undefined}
          />
          <Row label="Registry PDA" value={registryPda.toBase58()} href={explorerUrl(registryPda.toBase58())} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Registry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!deployed && (
            <p className="text-muted-foreground">
              The program is not deployed yet. Deploy the Anchor program to {DEFAULT_CLUSTER} and set{' '}
              <code translate="no" className="font-mono">FRACTIONAX_PROGRAM_ID</code> — see{' '}
              <code translate="no" className="font-mono">onchain/README.md</code>.
            </p>
          )}
          {deployed && error && (
            <p role="alert" className="text-destructive">
              Could not read the chain: {error}
            </p>
          )}
          {deployed && !error && !registry && (
            <p className="text-muted-foreground">
              The program is configured but the registry is not initialized. Run the{' '}
              <code translate="no" className="font-mono">initialize</code> instruction (see{' '}
              <code translate="no" className="font-mono">onchain/README.md</code>).
            </p>
          )}
          {registry && (
            <>
              <Row
                label="Authority"
                value={registry.authority.toBase58()}
                href={explorerUrl(registry.authority.toBase58())}
              />
              <Row label="Deals registered on-chain" value={registry.dealCount.toString()} />
            </>
          )}
        </CardContent>
      </Card>

      <Link
        href="/app"
        className="mt-8 inline-block rounded text-sm text-muted-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        ← Back to dashboard
      </Link>
    </main>
  );
}
