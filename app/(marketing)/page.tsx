import Link from 'next/link';
import type { CSSProperties } from 'react';

import { HeroPreview } from '@/components/hero-preview';
import { Reveal } from '@/components/reveal';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Per-item stagger index for the Reveal `stagger` mode.
const revealStyle = (i: number) => ({ '--reveal-i': i }) as CSSProperties;

export const metadata = {
  title: { absolute: 'FractionAX — Agentic RWA investing on Solana' },
  description:
    'Describe an investment in plain language. FractionAX agents source vetted real-world-asset deals, underwrite them, and prepare them for on-chain execution — with you in control.',
};

const STEPS = [
  {
    n: '01',
    title: 'Describe it',
    body: 'Tell the Copilot what you want in plain language — “Invest $1,000 in low-risk Malaysian real estate.”',
  },
  {
    n: '02',
    title: 'Agents work',
    body: 'They parse your intent, source matching deals, value the asset from fundamentals, and draft an investment memo.',
  },
  {
    n: '03',
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
    <main id="main" className="bg-hero-glow blueprint-grid">
      {/* Hero */}
      <section className="px-safe mx-auto max-w-6xl py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div aria-hidden className="mb-6 h-px w-10 bg-brand-gold" />
            <p className="kicker text-primary">Agentic RWA · Solana</p>
            <h1 className="mt-5 text-balance font-serif text-[2.75rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              Invest in real-world assets by describing what you want
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              <span translate="no">FractionAX</span> agents source vetted deals, underwrite them,
              and prepare them for on-chain execution on Solana — you stay in control at every step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/app" className={cn(buttonVariants(), 'h-11 px-6')}>
                Launch app
              </Link>
              <Link
                href="/app/deals"
                className={cn(buttonVariants({ variant: 'outline' }), 'h-11 px-6')}
              >
                Browse deals
              </Link>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* How it works */}
      <Reveal stagger>
        <section className="border-t bg-muted/30">
          <div className="px-safe mx-auto max-w-5xl py-16 sm:py-20">
            <p className="kicker reveal-item text-muted-foreground" style={revealStyle(0)}>
              The flow
            </p>
            <h2
              className="reveal-item mt-3 text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
              style={revealStyle(1)}
            >
              How it works
            </h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.n} className="reveal-item" style={revealStyle(i + 2)}>
                  <div className="font-mono text-2xl font-semibold tabular-nums text-primary">
                    {s.n}
                  </div>
                  <div className="mt-3 border-t pt-4">
                    <h3 className="font-medium">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* Features */}
      <Reveal stagger>
        <section className="px-safe mx-auto max-w-5xl py-16 sm:py-20">
          <p className="kicker reveal-item text-muted-foreground" style={revealStyle(0)}>
            What you get
          </p>
          <h2
            className="reveal-item mt-3 text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
            style={revealStyle(1)}
          >
            Built for the next wave of RWA
          </h2>
          {/* Hairline-divided grid of flat cells — blueprint, no shadows. */}
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border-2 bg-border sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="reveal-item bg-card p-6" style={revealStyle(i + 2)}>
                <div className="kicker text-muted-foreground">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-3 font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <section className="px-safe mx-auto max-w-5xl pb-12">
          <div className="bracket shadow-brutal rounded-xl border-2 bg-card px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="kicker text-muted-foreground">Ready</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
                  Ready to try it?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open the app and ask the Copilot for your first deal.
                </p>
              </div>
              <Link href="/app" className={cn(buttonVariants(), 'h-11 px-6')}>
                Launch app
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
