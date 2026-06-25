'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/copilot', label: 'Copilot' },
  { href: '/deals', label: 'Deals' },
];

const focusRing =
  'rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="px-safe mx-auto flex max-w-3xl items-center gap-6 py-2">
      <Link href="/" translate="no" className={cn('font-semibold tracking-tight', focusRing)}>
        FractionAX
      </Link>
      <div className="flex gap-4 text-sm">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-11 items-center transition-colors hover:text-foreground',
                active ? 'text-foreground' : 'text-muted-foreground',
                focusRing,
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
