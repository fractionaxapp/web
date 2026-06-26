'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/components/auth-context';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/app', label: 'Copilot' },
  { href: '/app/deals', label: 'Deals' },
  { href: '/app/portfolio', label: 'Portfolio' },
  { href: '/app/onchain', label: 'On-chain' },
];

const brandRing = 'rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function isActive(pathname: string, href: string): boolean {
  return href === '/app' ? pathname === '/app' : pathname.startsWith(href);
}

function NavLinks({ pathname, className }: { pathname: string; className: string }) {
  return (
    <nav className={className} aria-label="Dashboard">
      {LINKS.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'bg-accent font-medium text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountChip() {
  const { ready, authenticated, label, signIn, signOut } = useAuth();
  if (!ready) return null;

  if (!authenticated) {
    return (
      <button
        type="button"
        onClick={signIn}
        className="inline-flex min-h-11 items-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground transition-[background-color,transform] duration-100 ease-out hover:bg-primary/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        title={label}
        className="max-w-[16ch] truncate rounded-full bg-accent px-2 py-1 text-accent-foreground"
      >
        {label}
      </span>
      <button
        type="button"
        onClick={signOut}
        className="inline-flex min-h-11 items-center rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Sign out
      </button>
    </div>
  );
}

/** Dashboard chrome: a left sidebar on desktop, a stacked top bar on mobile. */
export function DashboardNav() {
  const pathname = usePathname();
  return (
    <>
      <aside className="hidden border-r md:flex md:w-56 md:shrink-0 md:flex-col">
        <div className="m-4 flex items-center justify-between gap-2">
          <Link href="/" aria-label="FractionAX — home" className={cn('inline-flex', brandRing)}>
            <Logo className="h-7" />
          </Link>
          <ThemeToggle />
        </div>
        <NavLinks pathname={pathname} className="flex flex-col gap-1 px-2 pb-2" />
        <div className="mt-auto border-t p-3">
          <AccountChip />
        </div>
      </aside>

      <header className="border-b md:hidden [padding-top:env(safe-area-inset-top)]">
        <div className="px-safe py-2">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="FractionAX — home" className={cn('inline-flex', brandRing)}>
              <Logo className="h-6" />
            </Link>
            <AccountChip />
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <NavLinks pathname={pathname} className="flex flex-wrap gap-1 text-sm" />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
