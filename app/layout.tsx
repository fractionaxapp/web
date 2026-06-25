import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { MainNav } from '@/components/main-nav';

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
        <header className="border-b [padding-top:env(safe-area-inset-top)]">
          <MainNav />
        </header>
        {children}
      </body>
    </html>
  );
}
