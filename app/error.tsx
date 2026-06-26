'use client';

import { Button } from '@/components/ui/button';

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
      <h1 className="font-mono uppercase text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground">An unexpected error occurred. You can try again.</p>
      <Button onClick={reset} className="mt-2 h-10 px-4">
        Try again
      </Button>
      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>
      )}
    </main>
  );
}
