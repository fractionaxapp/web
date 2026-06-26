'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, type ReactNode } from 'react';

import { AuthIdentityProvider, shortenAddress } from '@/components/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

/** Shared loading state while auth resolves (avoids a hydration flash). */
export function GateLoading() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center" aria-busy="true">
      <Spinner className="size-6 text-muted-foreground" />
      <span className="sr-only">Loading…</span>
    </main>
  );
}

/** Privy gate — the only sign-in path. Privy's modal covers email, Google, X, and
 * external Solana wallets, plus an embedded wallet for users without one. */
export function PrivyGate({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, @eslint-react/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !ready) return <GateLoading />;

  if (authenticated) {
    const label = user?.email?.address ?? shortenAddress(user?.wallet?.address) ?? 'Account';
    return (
      <AuthIdentityProvider value={{ label, signOut: () => void logout() }}>
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
            <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to use the FractionAX app — email, Google, X, or a Solana wallet. This is
              devnet, so no funds move.
            </p>
          </div>
          <Button onClick={() => login()} className="h-10 px-4">
            Sign in
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
