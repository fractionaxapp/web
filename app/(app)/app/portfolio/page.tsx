import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Portfolio' };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-5">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function PortfolioPage() {
  // No auth or positions yet — an honest empty state until on-chain holdings are wired.
  return (
    <main id="main" className="px-safe max-w-3xl py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Your positions, projected yield, and risk concentration — once you start investing.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Invested" value="$0" />
        <Stat label="Projected annual yield" value="0%" />
        <Stat label="Positions" value="0" />
      </div>

      <Card className="mt-4">
        <CardContent className="flex flex-col items-start gap-3 py-10 text-sm">
          <p className="text-muted-foreground">
            No positions yet. Discover a deal and draft a memo to get started.
          </p>
          <Link href="/app/deals" className={cn(buttonVariants(), 'h-10 px-4')}>
            Browse Deals
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
