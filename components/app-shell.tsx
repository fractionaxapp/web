'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { AuthBridge } from '@/components/auth-bridge';
import { DashboardNav } from '@/components/dashboard-nav';
import { PRIVY_APP_ID, PrivyProviders } from '@/components/privy';

const footerLink =
  'inline-flex min-h-11 items-center rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="md:flex md:min-h-dvh">
      <DashboardNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <footer className="px-safe border-t py-3">
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
            aria-label="Footer"
          >
            <Link href="/docs" className={footerLink}>
              Docs
            </Link>
            <Link href="/terms" className={footerLink}>
              Terms
            </Link>
            <Link href="/privacy" className={footerLink}>
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}

/** The /app dashboard chrome. The nav + Privy context wrap every page; individual
 * pages decide whether to gate their content (Copilot, portfolio) via RequireAuth.
 * Deals and on-chain are public. NEXT_PUBLIC_PRIVY_APP_ID must be set at build time. */
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
      <AuthBridge>
        <Shell>{children}</Shell>
      </AuthBridge>
    </PrivyProviders>
  );
}
