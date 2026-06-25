'use client';

import type { Deal, InvestmentIntent, InvestmentMemo } from '@fractionax/domain';
import { useEffect, useRef, useState } from 'react';

import { DealCard } from '@/components/deal-card';
import { IntentSummary } from '@/components/intent-summary';
import { MemoView } from '@/components/memo-view';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { streamCopilot } from '@/lib/copilot';

const EXAMPLES = [
  'Invest $1,000 in low-risk Malaysian opportunities',
  'Show me high-yield revenue-share deals',
  'Discover invoice deals in Singapore',
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

export default function CopilotPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<InvestmentIntent | null>(null);
  const [deals, setDeals] = useState<Deal[] | null>(null);
  const [memo, setMemo] = useState<InvestmentMemo | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // On mount: restore a shared/refreshed prompt from the URL (does not auto-run),
  // and focus the input on desktop only (autofocus is jarring on mobile — it pops
  // the keyboard). Runs after mount to stay hydration-safe.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    // eslint-disable-next-line react-hooks/set-state-in-effect, @eslint-react/set-state-in-effect
    if (q) setMessage(q);
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, []);

  async function ask(prompt: string): Promise<void> {
    const text = prompt.trim();
    if (!text || loading) return;
    // Persist the prompt in the URL so it survives refresh and is shareable.
    const url = new URL(window.location.href);
    url.searchParams.set('q', text);
    window.history.replaceState(null, '', url);
    setLoading(true);
    const startedAt = performance.now();
    setError(null);
    setIntent(null);
    setDeals(null);
    setMemo(null);
    try {
      await streamCopilot(text, { onIntent: setIntent, onDeals: setDeals, onMemo: setMemo });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not reach the agent. Check your connection and try again.',
      );
    } finally {
      // Keep the loading state visible long enough to avoid a flicker on fast responses.
      const elapsed = performance.now() - startedAt;
      if (elapsed < 400) await new Promise((resolve) => setTimeout(resolve, 400 - elapsed));
      setLoading(false);
    }
  }

  const expectsMemo =
    !!intent &&
    (intent.action === 'invest' || intent.action === 'discover') &&
    !!deals &&
    deals.length > 0;

  return (
    <main id="main" className="px-safe mx-auto max-w-3xl py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Copilot</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Describe what you want to invest in. The agent parses your intent, sources matching deals,
        and drafts an investment memo — streamed back as each step completes.
      </p>

      <div className="mt-6 space-y-3">
        <label htmlFor="copilot-input" className="sr-only">
          Describe your investment
        </label>
        <Textarea
          id="copilot-input"
          name="prompt"
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Invest $1,000 in low-risk Malaysian real estate…"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void ask(message);
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => {
                  setMessage(example);
                  void ask(example);
                }}
              >
                {example}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => void ask(message)}
            disabled={loading || !message.trim()}
            aria-busy={loading}
            className="min-w-20"
          >
            {loading && <Spinner className="size-4" />}
            Ask
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Press&nbsp;⌘/Ctrl&nbsp;+&nbsp;Enter to send.</p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {(intent || loading) && !error && (
        <div className="mt-8 space-y-6" aria-live="polite" aria-busy={loading}>
          <section>
            <SectionLabel>Parsed intent</SectionLabel>
            {intent ? (
              <IntentSummary intent={intent} />
            ) : (
              <Skeleton className="h-7 w-72" />
            )}
          </section>

          {intent && (
            <section>
              <SectionLabel>Matching deals{deals ? ` (${deals.length})` : ''}</SectionLabel>
              {deals ? (
                <div className="grid gap-3">
                  {deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                  {deals.length === 0 && (
                    <p className="text-sm text-muted-foreground">No deals matched that intent.</p>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  <Skeleton className="h-28 rounded-xl" />
                  <Skeleton className="h-28 rounded-xl" />
                </div>
              )}
            </section>
          )}

          {expectsMemo && (
            <section>
              <SectionLabel>Top match — underwriting</SectionLabel>
              {memo && deals?.[0] ? (
                <MemoView memo={memo} currency={deals[0].currency} />
              ) : (
                <Skeleton className="h-44 rounded-xl" />
              )}
            </section>
          )}
        </div>
      )}
    </main>
  );
}
