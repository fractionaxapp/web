'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState, type ReactNode } from 'react';

import { AuthIdentityProvider, shortenAddress } from '@/components/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

/** Shared loading state while wallet/auth state resolves (avoids hydration flash). */
export function GateLoading() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center" aria-busy="true">
      <Spinner className="size-6 text-muted-foreground" />
      <span className="sr-only">Loading…</span>
    </main>
  );
}

/** Wallet-adapter-only gate (used when Privy is not configured). */
export function WalletGate({ children }: { children: ReactNode }) {
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, @eslint-react/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || connecting) return <GateLoading />;

  if (connected) {
    const label = shortenAddress(publicKey?.toBase58()) ?? 'Wallet';
    return (
      <AuthIdentityProvider value={{ label, signOut: () => void disconnect() }}>
        {children}
      </AuthIdentityProvider>
    );
  }

  return (
    <main
      id="main"
      className="px-safe mx-auto flex min-h-dvh max-w-md flex-col justify-center py-12"
    >
      <Card>
        <CardContent className="flex flex-col items-start gap-4 py-10">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Connect your wallet</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect a Solana wallet to use the FractionAX app. This is devnet — no funds move.
            </p>
          </div>
          <Button onClick={() => setVisible(true)} className="h-10 px-4">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
