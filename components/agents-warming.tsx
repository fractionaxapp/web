'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

const MAX_TRIES = 5;
const DELAY_MS = 11_000; // just over the server fetch timeout, so retries don't overlap

/** Shown when the agents service is cold-starting (free tier spins down when
 * idle). Re-runs the server fetch via router.refresh() on a timer until the
 * agents wake and the page renders its data — so a first visit recovers itself
 * instead of dead-ending on an error. */
export function AgentsWarming() {
  const router = useRouter();
  const [tries, setTries] = useState(0);
  const done = tries >= MAX_TRIES;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => {
      setTries((n) => n + 1);
      router.refresh();
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, [tries, done, router]);

  return (
    <div className="mt-8 space-y-4">
      <div className="max-w-md border border-dashed p-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {!done && <Spinner className="size-4 text-primary" />}
          {done ? 'Still warming' : 'Warming up the agents'}
        </div>
        {done ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              The agents are taking longer than usual to wake. Give it a moment, then retry.
            </p>
            <button
              type="button"
              onClick={() => {
                setTries(0);
                router.refresh();
              }}
              className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 h-10 px-4')}
            >
              Retry
            </button>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground" role="status" aria-live="polite">
            The first load can take up to 30 seconds. This page is retrying automatically — no need
            to refresh.
          </p>
        )}
      </div>

      {/* Fill the content area with placeholder rows so a cold start reads as
          loading rather than a broken, empty page. */}
      <div aria-hidden className="space-y-2">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((k) => (
          <Skeleton key={k} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
