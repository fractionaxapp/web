import Link from 'next/link';
import type { ReactNode } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ring = 'rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b [padding-top:env(safe-area-inset-top)]">
        <nav className="px-safe mx-auto flex max-w-5xl items-center justify-between py-3">
          <Link
            href="/"
            translate="no"
            className={cn('font-semibold tracking-tight', ring)}
          >
            FractionAX
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/app/deals"
              className={cn(
                'hidden min-h-11 items-center px-3 text-sm text-muted-foreground hover:text-foreground sm:inline-flex',
                ring,
              )}
            >
              Deals
            </Link>
            <Link href="/app" className={cn(buttonVariants(), 'h-10 px-4')}>
              Launch App
            </Link>
          </div>
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-24 border-t">
        <div className="px-safe mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
          <span translate="no">FractionAX — agentic RWA investing on Solana.</span>
          <Link
            href="/app"
            className={cn('inline-flex min-h-11 items-center hover:text-foreground', ring)}
          >
            Launch App →
          </Link>
        </div>
      </footer>
    </div>
  );
}
