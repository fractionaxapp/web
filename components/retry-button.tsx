'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

/** Re-runs the current route's server render (re-fetching data). For error
 * states on dynamic server pages, where a same-URL link wouldn't re-fetch. */
export function RetryButton() {
  const router = useRouter();
  return (
    <Button variant="outline" size="sm" onClick={() => router.refresh()}>
      Try again
    </Button>
  );
}
