import Link from 'next/link';

import { Copilot } from '@/components/copilot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ring = 'rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const metadata = { title: 'Copilot' };

const SHORTCUTS = [
  { href: '/app/deals', title: 'Browse deals', body: 'Filter sourced alternative-asset opportunities by risk and yield.' },
  { href: '/app/portfolio', title: 'Your portfolio', body: 'Track positions, projected yield, and concentration.' },
  { href: '/app/onchain', title: 'On-chain', body: 'Inspect the Solana program and registry, read live from devnet.' },
];

export default function DashboardHome() {
  return (
    <main id="main" className="px-safe max-w-3xl py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Copilot</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Describe an investment in plain language — the agents parse your intent, source matching
        deals, and draft a memo.
      </p>

      <div className="mt-6">
        <Copilot autoFocus />
      </div>

      <h2 className="mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Explore
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {SHORTCUTS.map((s) => (
          <Link key={s.href} href={s.href} className={cn('block', ring)}>
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <CardTitle className="text-base">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{s.body}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
