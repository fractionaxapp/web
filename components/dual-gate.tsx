'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState, type ReactNode } from 'react';

import { AuthIdentityProvider, shortenAddress } from '@/components/auth-context';
import { GateLoading } from '@/components/wallet-gate';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/** Gate that accepts EITHER a Privy login (email / Google / X / wallet) OR a
 * direct wallet-adapter connection. Used when Privy is configured. */
export function DualGate({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, @eslint-react/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !ready) return <GateLoading />;

  if (authenticated || connected) {
    const label = authenticated
      ? (user?.email?.address ?? shortenAddress(user?.wallet?.address) ?? 'Account')
      : (shortenAddress(publicKey?.toBase58()) ?? 'Wallet');
    const signOut = authenticated ? () => void logout() : () => void disconnect();
    return <AuthIdentityProvider value={{ label, signOut }}>{children}</AuthIdentityProvider>;
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
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => login()} className="h-10 px-4">
              Sign in
            </Button>
            <Button variant="outline" onClick={() => setVisible(true)} className="h-10 px-4">
              Connect a wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
