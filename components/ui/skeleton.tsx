import { cn } from '@/lib/utils';

/** Loading placeholder that mirrors final content height to avoid layout shift. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-muted/60 motion-reduce:animate-none', className)}
    />
  );
}
