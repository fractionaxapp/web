'use client';

import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** App-level error boundary — a branded, recoverable fallback for unexpected
 * render-time throws (pages handle their own fetch errors inline). */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main"
      className="px-safe mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 py-12 text-center"
    >
      <h1 className="font-serif text-2xl font-semibold tracking-tight">This page didn’t load</h1>
      <p className="text-muted-foreground">Something broke on our end — not you.</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} className="h-10 px-4">
          Try again
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}>
          Back to home
        </Link>
      </div>
      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>
      )}
    </main>
  );
}
