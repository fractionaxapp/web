import Link from 'next/link';

import { Copilot } from '@/components/copilot';

export default function HomePage() {
  return (
    <main id="main" className="px-safe mx-auto max-w-3xl py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Agentic RWA investing on Solana
      </h1>
      <p className="mt-3 max-w-xl text-lg text-muted-foreground">
        Describe an investment in plain language. Agents parse your intent, source vetted
        real-world-asset deals, and draft a memo — with you in control at every step.
      </p>

      <div className="mt-8">
        <Copilot />
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Prefer to browse?{' '}
        <Link
          href="/deals"
          className="rounded font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          See all deals →
        </Link>
      </p>
    </main>
  );
}
