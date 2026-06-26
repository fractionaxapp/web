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
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div
            aria-hidden
            className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="font-medium">No positions yet</p>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              Discover a deal and draft a memo — your positions, projected yield, and risk
              concentration will show up here.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/app/deals" className={cn(buttonVariants(), 'h-10 px-4')}>
              Browse deals
            </Link>
            <Link href="/app" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}>
              Ask Copilot
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
