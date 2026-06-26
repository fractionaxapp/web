import { cn } from '@/lib/utils';

/** FractionAX wordmark. Shows the dark mark on light backgrounds and the light
 * mark on dark backgrounds (system preference). SVGs live in /public/brand. */
export function Logo({ className }: { className?: string }) {
  const base = 'w-auto';
  return (
    <>
      <img
        src="/brand/fractionax-logo-full-dark.svg"
        alt="FractionAX"
        width={1648}
        height={346}
        className={cn(base, 'dark:hidden', className)}
      />
      <img
        src="/brand/fractionax-logo-full-light.svg"
        alt="FractionAX"
        width={1648}
        height={346}
        className={cn(base, 'hidden dark:block', className)}
      />
    </>
  );
}
