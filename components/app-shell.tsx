'use client';

import type { ReactNode } from 'react';

import { DashboardNav } from '@/components/dashboard-nav';
import { DualGate } from '@/components/dual-gate';
import { PRIVY_APP_ID, PrivyProviders } from '@/components/privy';
import { WalletGate } from '@/components/wallet-gate';
import { WalletProviders } from '@/components/wallet';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="md:flex md:min-h-dvh">
      <DashboardNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** The /app dashboard chrome. Auth is a wallet-adapter gate by default; when a
 * Privy app id is configured, it becomes a dual gate (Privy + wallet-adapter).
 * The branch is resolved at build time from NEXT_PUBLIC_PRIVY_APP_ID. */
export function AppShell({ children }: { children: ReactNode }) {
  const shell = <Shell>{children}</Shell>;

  if (PRIVY_APP_ID) {
    return (
      <PrivyProviders>
        <WalletProviders>
          <DualGate>{shell}</DualGate>
        </WalletProviders>
      </PrivyProviders>
    );
  }

  return (
    <WalletProviders>
      <WalletGate>{shell}</WalletGate>
    </WalletProviders>
  );
}
