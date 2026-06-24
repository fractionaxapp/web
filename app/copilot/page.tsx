'use client';

import type { Deal, InvestmentIntent, InvestmentMemo } from '@fractionax/domain';
import { useState } from 'react';

import { DealCard } from '@/components/deal-card';
import { IntentSummary } from '@/components/intent-summary';
import { MemoView } from '@/components/memo-view';
import { Button } from '@/components/ui/button';
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

  async function ask(prompt: string): Promise<void> {
    const text = prompt.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    setIntent(null);
    setDeals(null);
    setMemo(null);
    try {
      await streamCopilot(text, { onIntent: setIntent, onDeals: setDeals, onMemo: setMemo });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const expectsMemo =
    !!intent &&
    (intent.action === 'invest' || intent.action === 'discover') &&
    !!deals &&
    deals.length > 0;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Copilot</h1>
      <p className="mt-1 text-muted-foreground">
        Describe what you want to invest in. The agent parses your intent, sources matching deals,
        and drafts an investment memo — streamed back as each step completes.
      </p>

      <div className="mt-6 space-y-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Invest $1,000 in low-risk Malaysian real estate"
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
          <Button onClick={() => void ask(message)} disabled={loading || !message.trim()}>
            {loading ? 'Thinking…' : 'Ask'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {(intent || loading) && !error && (
        <div className="mt-8 space-y-6">
          <section>
            <SectionLabel>Parsed intent</SectionLabel>
            {intent ? (
              <IntentSummary intent={intent} />
            ) : (
              <p className="text-sm text-muted-foreground">Parsing intent…</p>
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
                <p className="text-sm text-muted-foreground">Sourcing deals…</p>
              )}
            </section>
          )}

          {expectsMemo && (
            <section>
              <SectionLabel>Top match — underwriting</SectionLabel>
              {memo && deals?.[0] ? (
                <MemoView memo={memo} currency={deals[0].currency} />
              ) : (
                <p className="text-sm text-muted-foreground">Drafting investment memo…</p>
              )}
            </section>
          )}
        </div>
      )}
    </main>
  );
}
