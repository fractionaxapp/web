import Link from 'next/link';

import { Copilot } from '@/components/copilot';
import { PageHeader } from '@/components/page-header';
import { RequireAuth } from '@/components/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ring = 'rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const metadata = { title: 'Copilot' };

const SHORTCUTS = [
  { href: '/app/deals', title: 'Browse deals', body: 'Filter sourced alternative-asset opportunities by risk and yield.' },
  { href: '/app/portfolio', title: 'Your portfolio', body: 'Track positions, projected yield, and concentration.' },
  { href: '/app/onchain', title: 'On-chain', body: 'Inspect the Solana program and registry, read live from devnet.' },
];

const explore = (
  <>
    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Explore</h2>
    <div className="mt-3 grid gap-4 sm:grid-cols-3">
      {SHORTCUTS.map((s) => (
        <Link key={s.href} href={s.href} className={cn('group block', ring)}>
          <Card className="h-full transition-[transform,box-shadow,border-color] duration-150 ease-out hover:border-primary/40 hover:shadow-md motion-safe:hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                {s.title}
                <span
                  aria-hidden
                  className="text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-primary"
                >
                  →
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{s.body}</CardContent>
          </Card>
        </Link>
      ))}
    </div>
  </>
);

export default function DashboardHome() {
  return (
    <RequireAuth>
      <main id="main" className="px-safe mx-auto max-w-5xl py-12">
        <PageHeader
          kicker="Workspace"
          title="Copilot"
          description="Describe an investment in plain language — the agents parse your intent, source matching deals, and draft a memo."
        />

      <div className="mt-8">
        {/* The Explore shortcuts are empty-state guidance — the Copilot hides them
            once a query runs so results don't compete with nav chrome. */}
        <Copilot autoFocus emptyStateExtra={explore} />
      </div>
      </main>
    </RequireAuth>
  );
}
