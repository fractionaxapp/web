import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Portfolio' };

export default function PortfolioPage() {
  // No auth or positions yet — a single, honest empty state (no placeholder zeros
  // that read as a broken/loading dashboard). Stats return once holdings are wired.
  return (
    <main id="main" className="px-safe max-w-3xl py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Your positions, projected yield, and risk concentration — once you start investing.
      </p>

      <Card className="mt-6">
        <CardContent className="flex flex-col items-start gap-3 py-12 text-sm">
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
