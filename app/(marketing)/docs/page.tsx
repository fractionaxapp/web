import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Docs',
  description: 'How FractionAX works — the agentic flow, asset types, NAV pricing, and on-chain settlement.',
};

const SECTIONS = [
  {
    h: 'What FractionAX is',
    p: 'FractionAX is agentic infrastructure for investing in real-world assets (RWAs) on Solana. Instead of forms and dashboards, you describe what you want in plain language and a set of agents do the work — sourcing deals, underwriting them, and preparing them for on-chain execution. You stay in control: the agents propose, you approve.',
  },
  {
    h: 'The Copilot',
    p: 'The Copilot is the main way you interact with FractionAX. You write something like “Invest $1,000 in low-risk Malaysian real estate.” It parses your intent, sources matching deals, values the asset, and drafts an investment memo — streaming each stage as it lands so you can follow the reasoning.',
  },
  {
    h: 'Asset types',
    p: 'FractionAX focuses on alternative, cash-flowing assets that are hard to access individually: IP royalties, invoices, and revenue-share agreements. Each deal is fractionalized so you can take a small position, and priced from its fundamentals rather than market hype.',
  },
  {
    h: 'Underwriting & NAV',
    p: 'Every deal is underwritten with a net-asset-value (NAV) model — a fundamental discounted-cash-flow valuation with an illiquidity haircut appropriate to private assets. The Copilot’s memo shows the projected yield, the valuation, the risk tier, and the key risks, so you can judge a deal on substance.',
  },
  {
    h: 'On-chain on Solana',
    p: 'Fractional ownership and settlement happen on a Solana program (currently on devnet). The On-chain page reads the live program and registry so you can verify state directly on the chain. Addresses link to the Solana Explorer on the active cluster.',
  },
  {
    h: 'You stay in control',
    p: 'FractionAX never moves funds or custodies assets without your consent. Agents surface options and prepare transactions; approving and signing is always your decision. Browsing deals and on-chain data needs no account — signing in (email, Google, X, or a Solana wallet) is only required to use the Copilot and track a portfolio.',
  },
  {
    h: 'Project status',
    p: 'FractionAX is an early-stage prototype running on Solana devnet. No real funds move and figures shown are illustrative. Treat everything here as a demonstration of the architecture, not a live financial product.',
  },
];

export default function DocsPage() {
  return (
    <main id="main" className="px-safe mx-auto max-w-2xl py-16">
      <p className="text-sm font-medium text-primary">Documentation</p>
      <h1 className="mt-2 text-balance font-mono uppercase text-3xl font-semibold tracking-tight">
        How <span translate="no">FractionAX</span> works
      </h1>
      <p className="mt-3 text-pretty text-lg text-muted-foreground">
        A short overview of the agentic flow, the assets, and the on-chain layer.
      </p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h} className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">{s.h}</h2>
            <p className="text-pretty leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3 border-t pt-8">
        <Link href="/app" className={cn(buttonVariants(), 'h-10 px-4')}>
          Launch app
        </Link>
        <Link href="/app/deals" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}>
          Browse deals
        </Link>
      </div>
    </main>
  );
}
