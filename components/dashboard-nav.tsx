'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app/copilot', label: 'Copilot' },
  { href: '/app/deals', label: 'Deals' },
  { href: '/app/portfolio', label: 'Portfolio' },
  { href: '/app/onchain', label: 'On-chain' },
];

const ring = 'rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function isActive(pathname: string, href: string): boolean {
  return href === '/app' ? pathname === '/app' : pathname.startsWith(href);
}

function NavLinks({
  pathname,
  className,
  linkClassName,
}: {
  pathname: string;
  className: string;
  linkClassName?: string;
}) {
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
              'inline-flex min-h-11 items-center whitespace-nowrap transition-colors',
              active ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
              ring,
              linkClassName,
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Dashboard chrome: a left sidebar on desktop, a top bar on mobile. */
export function DashboardNav() {
  const pathname = usePathname();
  return (
    <>
      <aside className="hidden border-r md:flex md:w-56 md:shrink-0 md:flex-col">
        <Link
          href="/"
          translate="no"
          className={cn('m-4 inline-flex font-semibold tracking-tight', ring)}
        >
          FractionAX
        </Link>
        <NavLinks pathname={pathname} className="flex flex-col gap-1 px-2" linkClassName="px-2" />
      </aside>

      <header className="border-b md:hidden [padding-top:env(safe-area-inset-top)]">
        <div className="px-safe flex items-center gap-4 py-2">
          <Link href="/" translate="no" className={cn('font-semibold tracking-tight', ring)}>
            FractionAX
          </Link>
          <NavLinks pathname={pathname} className="flex gap-4 overflow-x-auto text-sm" />
        </div>
      </header>
    </>
  );
}
