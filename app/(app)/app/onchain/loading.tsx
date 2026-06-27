import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

// Shown while the live devnet read resolves, so navigation paints instantly.
// Mirrors the loaded page's PageHeader so there's no header jump.
export default function OnchainLoading() {
  return (
    <main id="main" className="px-safe mx-auto max-w-5xl py-12">
      <PageHeader
        kicker="Network"
        title="On-chain"
        description="The Fractionax Solana program and its registry, read live from devnet."
        action={<Skeleton className="h-6 w-16" />}
      />

      <div className="mt-6 grid gap-4" aria-busy="true" aria-label="Loading on-chain state">
        <Skeleton className="h-32" />
        <Skeleton className="h-28" />
      </div>
    </main>
  );
}
