import { Badge } from '@/components/ui/badge';

/** A static, on-brand snapshot of the Copilot flow for the marketing hero —
 * shows what "describe an investment" actually produces. Decorative (the
 * adjacent hero copy carries the message), so the whole thing is aria-hidden
 * and non-interactive (no fake controls / dead zones). */
export function HeroPreview() {
  return (
    <div aria-hidden className="pointer-events-none select-none">
      <div className="shadow-card overflow-hidden rounded-xl border bg-card">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-muted-foreground/25" />
            <span className="size-2.5 rounded-full bg-muted-foreground/25" />
            <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">Copilot</span>
          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Example
          </span>
        </div>

        <div className="space-y-4 p-4">
          {/* the prompt */}
          <div className="rounded-md border bg-background px-3 py-2 text-sm">
            Invest $1,000 in low-risk Malaysian real estate
          </div>

          {/* parsed intent */}
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Parsed intent
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Invest', '$1,000', 'Low risk', 'Malaysia'].map((t) => (
                <span
                  key={t}
                  className="rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* top match */}
          <div>
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Top match
            </div>
            <div className="rounded-lg border bg-background p-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-medium">KL serviced-apartment lease</span>
                <Badge variant="low">low risk</Badge>
              </div>
              <div className="mt-3 flex items-end gap-6">
                <div>
                  <div className="text-xs text-muted-foreground">Projected yield</div>
                  <div className="font-mono text-xl font-semibold tabular-nums text-brand-gold">
                    8.5%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Minimum</div>
                  <div className="font-mono text-sm font-medium tabular-nums">$500</div>
                </div>
              </div>
            </div>
          </div>

          {/* memo line */}
          <div className="rounded-md bg-secondary/60 px-3 py-2 text-xs leading-relaxed text-secondary-foreground">
            <span className="font-medium text-foreground">Memo · Recommended.</span> Stable lease
            income, NAV-backed valuation, low concentration risk.
          </div>
        </div>
      </div>
    </div>
  );
}
