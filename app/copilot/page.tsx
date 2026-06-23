'use client';

import { useState } from 'react';

import { DealCard } from '@/components/deal-card';
import { IntentSummary } from '@/components/intent-summary';
import { MemoView } from '@/components/memo-view';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CopilotResponse } from '@/lib/copilot';

const EXAMPLES = [
  'Invest $1,000 in low-risk Malaysian opportunities',
  'Show me high-yield revenue-share deals',
  'Discover invoice deals in Singapore',
];

export default function CopilotPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CopilotResponse | null>(null);

  async function ask(prompt: string): Promise<void> {
    const text = prompt.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const json: unknown = await res.json();
      if (!res.ok) {
        const detail = (json as { error?: string }).error;
        throw new Error(detail ?? `Request failed (${res.status})`);
      }
      const parsed = CopilotResponse.safeParse(json);
      if (!parsed.success) throw new Error('Unexpected response shape from the agent.');
      setResult(parsed.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Copilot</h1>
      <p className="mt-1 text-muted-foreground">
        Describe what you want to invest in. The agent parses your intent, sources matching deals,
        and drafts an investment memo.
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

      {result && (
        <div className="mt-8 space-y-6">
          <section>
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Parsed intent
            </h2>
            <IntentSummary intent={result.intent} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Matching deals ({result.deals.length})
            </h2>
            <div className="grid gap-3">
              {result.deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
              {result.deals.length === 0 && (
                <p className="text-sm text-muted-foreground">No deals matched that intent.</p>
              )}
            </div>
          </section>

          {result.memo && result.deals[0] && (
            <section>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Top match — underwriting
              </h2>
              <MemoView memo={result.memo} currency={result.deals[0].currency} />
            </section>
          )}
        </div>
      )}
    </main>
  );
}
