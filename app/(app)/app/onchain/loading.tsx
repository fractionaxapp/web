import { Skeleton } from '@/components/ui/skeleton';

// Shown while the live devnet read resolves, so navigation paints instantly.
export default function OnchainLoading() {
  return (
    <main id="main" className="px-safe max-w-3xl py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-mono uppercase text-2xl font-semibold tracking-tight">On-chain</h1>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        The Fractionax Solana program and its registry, read live from devnet.
      </p>

      <div className="mt-6 grid gap-4" aria-busy="true" aria-label="Loading on-chain state">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
    </main>
  );
}
