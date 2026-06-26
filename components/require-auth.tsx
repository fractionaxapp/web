'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { useAuth } from '@/components/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

function GateLoading() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center" aria-busy="true">
      <Spinner className="size-6 text-muted-foreground" />
      <span className="sr-only">Loading…</span>
    </main>
  );
}

/** Gates a page's content behind Privy sign-in. The dashboard nav stays visible
 * around it (logo → home, sign-in chip), so the user is never stranded. Use on
 * identity-bound pages only — deals and on-chain are public. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { ready, authenticated, signIn } = useAuth();

  if (!ready) return <GateLoading />;
  if (authenticated) return <>{children}</>;

  return (
    <main
      id="main"
      className="px-safe mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 py-12"
    >
      <Card>
        <CardContent className="flex flex-col items-start gap-4 py-10">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Sign in to continue</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to use the Copilot and track your portfolio — email, Google, X, or a Solana
              wallet. Browsing deals and on-chain data needs no account. This is devnet, so no
              funds move.
            </p>
          </div>
          <Button onClick={signIn} className="h-10 px-4">
            Sign in
          </Button>
        </CardContent>
      </Card>
      <Link
        href="/app/deals"
        className="inline-flex rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Browse deals without signing in →
      </Link>
    </main>
  );
}
