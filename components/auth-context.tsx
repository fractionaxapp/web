'use client';

import { createContext, use, type ReactNode } from 'react';

/** Auth state shared across the /app chrome, abstracted over Privy so the nav
 * and gates don't reach into the SDK directly. Always present (signed in or not). */
export type AuthState = {
  ready: boolean;
  authenticated: boolean;
  label?: string;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthState>({
  ready: false,
  authenticated: false,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = (): AuthState => use(AuthContext);

export function AuthProvider({ value, children }: { value: AuthState; children: ReactNode }) {
  return <AuthContext value={value}>{children}</AuthContext>;
}

/** Shorten a wallet address for display, e.g. "5xJ2…9aQ1". */
export function shortenAddress(address: string | undefined): string | undefined {
  return address ? `${address.slice(0, 4)}…${address.slice(-4)}` : undefined;
}
