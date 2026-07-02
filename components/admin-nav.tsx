'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/compliance', label: 'Compliance' },
  { href: '/admin/deals', label: 'Deals' },
  { href: '/admin/investors', label: 'Investors' },
];

function isActive(pathname: string, href: string): boolean {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
}

/** Admin dashboard chrome: sidebar on desktop, top bar on mobile. The signed-in
 * admin email + sign-out live at the foot. */
export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut(): Promise<void> {
    setSigningOut(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const link = (href: string, label: string, orientation: 'v' | 'h') => {
    const active = isActive(pathname, href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'inline-flex min-h-11 items-center whitespace-nowrap px-3 font-mono text-xs uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          orientation === 'v' ? 'border-l-2' : 'border-b-2',
          active
            ? 'border-primary bg-accent font-medium text-foreground'
            : 'border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground',
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <aside className="hidden border-r md:flex md:w-56 md:shrink-0 md:flex-col">
        <div className="m-4 flex items-center gap-2">
          <Link href="/" aria-label="FractionAX — home" className="inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Logo className="h-7" />
          </Link>
          <span className="kicker text-primary">Admin</span>
        </div>
        <nav className="flex flex-col gap-1 px-2 pb-2" aria-label="Admin">
          {LINKS.map((l) => link(l.href, l.label, 'v'))}
        </nav>
        <div className="mt-auto space-y-2 border-t p-3">
          <p className="max-w-full truncate font-mono text-xs text-muted-foreground" title={email}>
            {email}
          </p>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="inline-flex min-h-9 items-center font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      <header className="border-b md:hidden [padding-top:env(safe-area-inset-top)]">
        <div className="px-safe py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link href="/" aria-label="FractionAX — home" className="inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Logo className="h-6" />
              </Link>
              <span className="kicker text-primary">Admin</span>
            </div>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              Sign out
            </button>
          </div>
          <nav className="mt-1 flex flex-wrap gap-1" aria-label="Admin">
            {LINKS.map((l) => link(l.href, l.label, 'h'))}
          </nav>
        </div>
      </header>
    </>
  );
}
