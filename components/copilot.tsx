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
import { cn } from '@/lib/utils';

const EXAMPLES = [
  'Invest $1,000 in low-risk Malaysian opportunities',
  'Show me high-yield revenue-share deals',
  'Discover invoice deals in Singapore',
];

const RECENTS_KEY = 'copilot:recents';
const MAX_RECENTS = 5;
const chipClass =
  'touch-manipulation rounded-full border border-input px-3 py-1 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 [@media(pointer:coarse)]:min-h-11';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

type StepState = 'done' | 'active' | 'pending';

function StepDot({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    );
  }
  if (state === 'active') return <Spinner className="size-4 text-primary" />;
  return <span className="size-3.5 rounded-full border-2 border-muted-foreground/30" />;
}

/** Live status for the agent pipeline — each stage lights up as its result lands. */
function Stepper({ steps }: { steps: { label: string; state: StepState }[] }) {
  return (
    <ol aria-label="Agent progress" className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
      {steps.map((s, i) => (
        <li
          key={s.label}
          aria-current={s.state === 'active' ? 'step' : undefined}
          className="flex items-center gap-2"
        >
          {i > 0 && (
            <span aria-hidden className="select-none text-muted-foreground/40">
              →
            </span>
          )}
          <StepDot state={s.state} />
          <span
            className={cn(
              'whitespace-nowrap',
              s.state === 'pending' ? 'text-muted-foreground' : 'text-foreground',
              s.state === 'active' && 'font-medium',
            )}
          >
            {s.state === 'active' ? `${s.label}…` : s.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** The natural-language investing tool: parse intent, source deals, draft a memo —
 * streamed as each stage lands. Used standalone on /copilot and on the home hero. */
export function Copilot({ autoFocus = false }: { autoFocus?: boolean }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<InvestmentIntent | null>(null);
  const [deals, setDeals] = useState<Deal[] | null>(null);
  const [memo, setMemo] = useState<InvestmentMemo | null>(null);
  const [recents, setRecents] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // On mount: restore a shared/refreshed prompt from the URL (does not auto-run),
  // and focus the input on desktop only when asked (autofocus is jarring on
  // mobile). Runs after mount to stay hydration-safe.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    // eslint-disable-next-line react-hooks/set-state-in-effect, @eslint-react/set-state-in-effect
    if (q) setMessage(q);
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      // eslint-disable-next-line @eslint-react/set-state-in-effect
      if (raw) setRecents(JSON.parse(raw) as string[]);
    } catch {
      /* ignore unreadable storage */
    }
    if (autoFocus && window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
  }, [autoFocus]);

  function recordRecent(text: string): void {
    setRecents((prev) => {
      const next = [text, ...prev.filter((p) => p !== text)].slice(0, MAX_RECENTS);
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function clearRecents(): void {
    setRecents([]);
    try {
      localStorage.removeItem(RECENTS_KEY);
    } catch {
      /* ignore */
    }
  }

  // Auto-grow the textarea to fit its content (capped by max-height in the class).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [message]);

  async function ask(prompt: string): Promise<void> {
    const text = prompt.trim();
    if (!text || loading) return;
    recordRecent(text);
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
          : 'Couldn’t reach the agents. Check your connection and try again.',
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

  const steps: { label: string; state: StepState }[] = [
    { label: 'Parsing intent', state: intent ? 'done' : 'active' },
    { label: 'Sourcing deals', state: deals ? 'done' : intent ? 'active' : 'pending' },
    { label: 'Underwriting', state: memo ? 'done' : deals && expectsMemo ? 'active' : 'pending' },
  ];

  return (
    <div>
      <div className="space-y-3">
        <label htmlFor="copilot-input" className="sr-only">
          Describe your investment
        </label>
        <Textarea
          id="copilot-input"
          name="prompt"
          autoComplete="off"
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="max-h-60 resize-none"
          placeholder="e.g. Invest $1,000 in low-risk Malaysian real estate…"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void ask(message);
          }}
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Press&nbsp;⌘/Ctrl&nbsp;+&nbsp;Enter to send.</p>
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
        {recents.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Recent:</span>
            {recents.map((r) => (
              <button
                key={r}
                type="button"
                disabled={loading}
                title={`Edit and re-run: ${r}`}
                onClick={() => {
                  // A past prompt is yours to refine — populate and focus, don't auto-run.
                  setMessage(r);
                  inputRef.current?.focus();
                }}
                className={cn(chipClass, 'max-w-[30ch] truncate')}
              >
                {r}
              </button>
            ))}
            <button
              type="button"
              onClick={clearRecents}
              className="inline-flex min-h-11 touch-manipulation items-center rounded px-2 underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Try:</span>
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                disabled={loading}
                onClick={() => {
                  setMessage(example);
                  void ask(example);
                }}
                className={chipClass}
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="animate-rise mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {(intent || loading) && !error && (
        <div className="mt-8 space-y-6">
          {loading && (
            <div className="rounded-lg border bg-card/40 px-4 py-3">
              <Stepper steps={steps} />
            </div>
          )}
          <div className="space-y-6" aria-live="polite" aria-busy={loading}>
            <section className="animate-rise">
              <SectionLabel>Parsed intent</SectionLabel>
              {intent ? <IntentSummary intent={intent} /> : <Skeleton className="h-7 w-72" />}
            </section>

            {intent && (
              <section className="animate-rise">
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
              <section className="animate-rise">
                <SectionLabel>Top match — underwriting</SectionLabel>
                {memo && deals?.[0] ? (
                  <MemoView memo={memo} currency={deals[0].currency} />
                ) : (
                  <Skeleton className="h-44 rounded-xl" />
                )}
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
