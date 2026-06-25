'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { useMemo, type ReactNode } from 'react';

/** Public Privy app id. When unset, Privy is inactive and /app falls back to the
 * wallet-adapter gate — so this is safe to deploy before the id is configured. */
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function PrivyProviders({ children }: { children: ReactNode }) {
  const connectors = useMemo(() => toSolanaWalletConnectors(), []);
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID as string}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'wallet'],
        appearance: { walletChainType: 'solana-only' },
        embeddedWallets: { solana: { createOnLogin: 'users-without-wallets' } },
        externalWallets: { solana: { connectors } },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
