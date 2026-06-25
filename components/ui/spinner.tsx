import { cn } from '@/lib/utils';

/** Inline loading spinner. Decorative — the surrounding control conveys state. */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('motion-safe:animate-spin motion-reduce:opacity-60', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
