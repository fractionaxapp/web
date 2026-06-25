import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = {
  title: { absolute: 'FractionAX — Agentic RWA investing on Solana' },
  description:
    'Describe an investment in plain language. FractionAX agents source vetted real-world-asset deals, underwrite them, and prepare them for on-chain execution — with you in control.',
};

const STEPS = [
  {
    n: '1',
    title: 'Describe it',
    body: 'Tell the Copilot what you want in plain language — “Invest $1,000 in low-risk Malaysian real estate.”',
  },
  {
    n: '2',
    title: 'Agents work',
    body: 'They parse your intent, source matching deals, value the asset from fundamentals, and draft an investment memo.',
  },
  {
    n: '3',
    title: 'You decide',
    body: 'Review the memo and approve. Settlement happens on-chain on Solana — you stay in control at every step.',
  },
];

const FEATURES = [
  {
    title: 'Natural-language Copilot',
    body: 'No forms or dashboards to learn. Ask for what you want and watch the agents reason through it.',
  },
  {
    title: 'Alternative assets',
    body: 'IP royalties, invoices, and revenue-share deals — fractionalized and underwritten with NAV-based pricing.',
  },
  {
    title: 'On-chain on Solana',
    body: 'Compliant fractional ownership and settlement on a deployed Solana program — transparent and verifiable.',
  },
  {
    title: 'You stay in control',
    body: 'Agents propose; you approve. FractionAX never moves funds or custodies assets without your consent.',
  },
];

export default function MarketingHome() {
  return (
    <main id="main">
      {/* Hero */}
      <section className="px-safe mx-auto max-w-5xl py-20 sm:py-28">
        <p className="text-sm font-medium text-primary">Agentic RWA investment infrastructure</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Invest in real-world assets by describing what you want
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          FractionAX agents source vetted deals, underwrite them, and prepare them for on-chain
          execution on Solana — you stay in control at every step.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/app" className={cn(buttonVariants(), 'h-11 px-6')}>
            Launch App
          </Link>
          <Link
            href="/app/deals"
            className={cn(buttonVariants({ variant: 'outline' }), 'h-11 px-6')}
          >
            Browse Deals
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30">
        <div className="px-safe mx-auto max-w-5xl py-16">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n}>
                <div className="flex size-9 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground tabular-nums">
                  {s.n}
                </div>
                <h3 className="mt-4 font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="px-safe mx-auto max-w-5xl py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Built for the next wave of RWA</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-safe mx-auto max-w-5xl pb-8">
        <Card className="bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Ready to try it?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Open the app and ask the Copilot for your first deal.
              </p>
            </div>
            <Link href="/app" className={cn(buttonVariants(), 'h-11 px-6')}>
              Launch App
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
