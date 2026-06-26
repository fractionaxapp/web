'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { Buffer } from 'buffer';
import { useMemo, type ReactNode } from 'react';

/** Public Privy app id — the only auth path for /app. Inlined at build time. */
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

// Privy's Solana support (web3.js under the hood) expects a global Buffer in the browser.
const g = globalThis as typeof globalThis & { Buffer?: typeof Buffer };
if (typeof g.Buffer === 'undefined') g.Buffer = Buffer;

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
