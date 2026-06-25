import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'FractionAX',
  description: 'Agentic RWA investment infrastructure on Solana.',
};

// Match the browser chrome to the page background in each color scheme.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fcfa' },
    { media: '(prefers-color-scheme: dark)', color: '#101615' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <header className="border-b">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-6 py-4">
            <Link href="/" translate="no" className="font-semibold tracking-tight">
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
