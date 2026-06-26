'use client';

import type { ReactNode } from 'react';

import { DashboardNav } from '@/components/dashboard-nav';
import { PRIVY_APP_ID, PrivyProviders } from '@/components/privy';
import { PrivyGate } from '@/components/privy-gate';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="md:flex md:min-h-dvh">
      <DashboardNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** The /app dashboard chrome, gated by Privy. NEXT_PUBLIC_PRIVY_APP_ID must be set
 * at build time; without it, sign-in is unavailable. */
export function AppShell({ children }: { children: ReactNode }) {
  if (!PRIVY_APP_ID) {
    return (
      <main
        id="main"
        className="px-safe mx-auto flex min-h-dvh max-w-md flex-col justify-center py-12 text-center"
      >
        <h1 className="text-xl font-semibold tracking-tight">Sign-in unavailable</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set <code className="font-mono">NEXT_PUBLIC_PRIVY_APP_ID</code> to enable sign-in.
        </p>
      </main>
    );
  }

  return (
    <PrivyProviders>
      <PrivyGate>
        <Shell>{children}</Shell>
      </PrivyGate>
    </PrivyProviders>
  );
}
