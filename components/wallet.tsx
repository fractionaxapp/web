'use client';

import { getRpcUrl } from '@fractionax/solana';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Buffer } from 'buffer';
import { useMemo, type ReactNode } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css';

// @solana/web3.js expects a global Buffer in the browser.
const g = globalThis as typeof globalThis & { Buffer?: typeof Buffer };
if (typeof g.Buffer === 'undefined') g.Buffer = Buffer;

/** Solana wallet context for the dashboard. Wallets are auto-detected via the
 * wallet standard (Phantom, Solflare, Backpack, …), so no adapters are listed. */
export function WalletProviders({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => getRpcUrl(), []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
