import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.fractionax.app'),
  title: { default: 'FractionAX', template: '%s — FractionAX' },
  description: 'Agentic RWA investment infrastructure on Solana.',
};

// Match the browser chrome to the page background in each color scheme.
export const viewport: Viewport = {
  // Single value (not media-query split) so the inline script + toggle can keep
  // it in sync with the user's chosen theme, not just the system preference.
  themeColor: '#f6f6f6',
};

// Set the theme class before first paint to avoid a flash: saved choice wins,
// otherwise system preference. Kept tiny and inlined so it runs synchronously.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',d?'#141b18':'#f6f6f6');}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        {/* Trusted static string; runs before paint to prevent a theme flash. */}
        {/* eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        {/* Each zone — marketing and /app dashboard — supplies its own chrome. */}
        {children}
      </body>
    </html>
  );
}
