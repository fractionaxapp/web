import Link from 'next/link';
import type { ReactNode } from 'react';

import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ring =
  'touch-manipulation rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Without JS the IntersectionObserver never fires — keep reveal content visible. */}
      <noscript>
        <style>
          {'.reveal,.reveal-group .reveal-item{opacity:1!important;transform:none!important}'}
        </style>
      </noscript>
      <header className="border-b [padding-top:env(safe-area-inset-top)]">
        <nav className="px-safe mx-auto flex max-w-5xl items-center justify-between py-3">
          <Link href="/" aria-label="FractionAX — home" className={cn('inline-flex', ring)}>
            <Logo className="h-7" />
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
            <ThemeToggle />
            <Link href="/app" className={cn(buttonVariants(), 'h-10 px-4')}>
              Launch app
            </Link>
          </div>
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-24 border-t">
        <div className="px-safe mx-auto flex max-w-5xl flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span translate="no">© 2026 FractionAX — agentic RWA investing on Solana.</span>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1" aria-label="Footer">
            <Link
              href="/docs"
              className={cn('inline-flex min-h-11 items-center hover:text-foreground', ring)}
            >
              Docs
            </Link>
            <Link
              href="/terms"
              className={cn('inline-flex min-h-11 items-center hover:text-foreground', ring)}
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className={cn('inline-flex min-h-11 items-center hover:text-foreground', ring)}
            >
              Privacy
            </Link>
            <Link
              href="/app"
              className={cn('inline-flex min-h-11 items-center hover:text-foreground', ring)}
            >
              Launch app →
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
