import type { ReactNode } from 'react';

/** Dashboard page header in the site's voice: a gold hairline accent (luxury),
 * a mono UPPERCASE kicker (terminal), and a serif title (editorial). Optional
 * right-aligned slot for a badge or action. */
export function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header>
      <div aria-hidden className="mb-4 h-px w-8 bg-brand-gold" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="kicker text-primary">{kicker}</p>
          <h1 className="mt-2 text-balance font-serif text-3xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {description ? <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p> : null}
    </header>
  );
}
