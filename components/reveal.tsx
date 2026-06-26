'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Reveals its children with a fade-and-rise the first time they scroll into
 * view. Progressive enhancement: sets a data attribute directly on the node
 * (no React state / re-render). The .reveal CSS is gated to
 * prefers-reduced-motion: no-preference, and a <noscript> fallback shows the
 * content when JS is off — so it never hides content from anyone. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.visible = 'true';
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.visible = 'true';
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn('reveal', className)}>
      {children}
    </div>
  );
}
