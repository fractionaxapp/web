import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main
      id="main"
      className="px-safe mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 py-12 text-center"
    >
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">That page doesn’t exist or has moved.</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants(), 'h-10 px-4')}>
          Back to home
        </Link>
        <Link href="/app" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}>
          Launch app
        </Link>
      </div>
    </main>
  );
}
