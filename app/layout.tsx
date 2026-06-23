import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'FractionAX',
  description: 'Agentic RWA investment infrastructure on Solana.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              FractionAX
            </Link>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/copilot" className="transition-colors hover:text-foreground">
                Copilot
              </Link>
              <Link href="/deals" className="transition-colors hover:text-foreground">
                Deals
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
