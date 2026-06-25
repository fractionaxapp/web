'use client';

import type { ReactNode } from 'react';

import { DashboardNav } from '@/components/dashboard-nav';
import { WalletGate } from '@/components/wallet-gate';
import { WalletProviders } from '@/components/wallet';

/** The /app dashboard chrome: wallet context → connect gate → sidebar shell. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <WalletProviders>
      <WalletGate>
        <div className="md:flex md:min-h-dvh">
          <DashboardNav />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </WalletGate>
    </WalletProviders>
  );
}
