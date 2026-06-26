'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { AuthProvider, shortenAddress } from '@/components/auth-context';

/** Reads Privy state and publishes it as AuthState for all /app pages — so the
 * nav and per-page gates share one source of truth, regardless of route. */
export function AuthBridge({ children }: { children: ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, @eslint-react/set-state-in-effect
    setMounted(true);
  }, []);

  const label = authenticated
    ? (user?.email?.address ?? shortenAddress(user?.wallet?.address) ?? 'Account')
    : undefined;

  const value = useMemo(
    () => ({
      ready: mounted && ready,
      authenticated: mounted && authenticated,
      label,
      signIn: () => login(),
      signOut: () => void logout(),
    }),
    [mounted, ready, authenticated, label, login, logout],
  );

  return <AuthProvider value={value}>{children}</AuthProvider>;
}
