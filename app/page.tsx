import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight">Agentic RWA investing on Solana</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Describe an investment in plain language. FractionAX agents parse your intent, source vetted
        real-world-asset deals, underwrite them, and prepare them for on-chain execution — with you
        in control at every step.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/copilot" className={cn(buttonVariants(), 'h-11 px-6')}>
          Try the Copilot
        </Link>
        <Link href="/deals" className={cn(buttonVariants({ variant: 'outline' }), 'h-11 px-6')}>
          Browse deals
        </Link>
      </div>
    </main>
  );
}
