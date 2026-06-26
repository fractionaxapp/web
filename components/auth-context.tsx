'use client';

import { createContext, use, type ReactNode } from 'react';

/** The signed-in identity, abstracted over the auth provider (Privy) so the
 * dashboard chrome doesn't reach into the auth SDK directly. */
export type AuthIdentity = { label: string; signOut: () => void } | null;

const AuthIdentityContext = createContext<AuthIdentity>(null);

export const useAuthIdentity = (): AuthIdentity => use(AuthIdentityContext);

export function AuthIdentityProvider({
  value,
  children,
}: {
  value: AuthIdentity;
  children: ReactNode;
}) {
  return <AuthIdentityContext value={value}>{children}</AuthIdentityContext>;
}

/** Shorten a wallet address for display, e.g. "5xJ2…9aQ1". */
export function shortenAddress(address: string | undefined): string | undefined {
  return address ? `${address.slice(0, 4)}…${address.slice(-4)}` : undefined;
}
