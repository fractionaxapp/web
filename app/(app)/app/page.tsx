import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ring = 'rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const SHORTCUTS = [
  { href: '/app/deals', title: 'Browse deals', body: 'Filter sourced alternative-asset opportunities by risk and yield.' },
  { href: '/app/portfolio', title: 'Your portfolio', body: 'Track positions, projected yield, and concentration.' },
  { href: '/app/onchain', title: 'On-chain', body: 'Inspect the Solana program and registry, read live from devnet.' },
];

export default function DashboardHome() {
  return (
    <main id="main" className="px-safe mx-auto max-w-3xl py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Start with the Copilot, or jump straight to deals, your portfolio, or the chain.
      </p>

      <Card className="mt-6 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Ask the Copilot</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md text-sm text-muted-foreground">
            Describe an investment in plain language — the agents parse your intent, source deals,
            and draft a memo.
          </p>
          <Link href="/app/copilot" className={cn(buttonVariants(), 'h-10 px-4')}>
            Open Copilot
          </Link>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
