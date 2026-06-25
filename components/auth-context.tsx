'use client';

import { createContext, useContext, type ReactNode } from 'react';

/** The signed-in identity, abstracted over the auth system (wallet-adapter or
 * Privy) so the dashboard chrome doesn't depend on which one is active. */
export type AuthIdentity = { label: string; signOut: () => void } | null;

const AuthIdentityContext = createContext<AuthIdentity>(null);

export const useAuthIdentity = (): AuthIdentity => useContext(AuthIdentityContext);

export function AuthIdentityProvider({
  value,
  children,
}: {
  value: AuthIdentity;
  children: ReactNode;
}) {
  return <AuthIdentityContext.Provider value={value}>{children}</AuthIdentityContext.Provider>;
}

/** Shorten a wallet address for display, e.g. "5xJ2…9aQ1". */
export function shortenAddress(address: string | undefined): string | undefined {
  return address ? `${address.slice(0, 4)}…${address.slice(-4)}` : undefined;
}
