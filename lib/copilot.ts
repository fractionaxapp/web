import { Deal, InvestmentIntent, InvestmentMemo } from '@fractionax/domain';
import { z } from 'zod';

import { deepCamel } from './case';

/** The Copilot's structured response, composed from the shared domain schemas.
 * Mirrors the agents service's `CopilotResult` (after camelCase transform). */
export const CopilotResponse = z.object({
  intent: InvestmentIntent,
  deals: z.array(Deal),
  memo: InvestmentMemo.nullish(),
});
export type CopilotResponse = z.infer<typeof CopilotResponse>;

/** Callbacks invoked as each streamed Copilot stage arrives. */
export interface CopilotStreamHandlers {
  onIntent: (intent: z.infer<typeof InvestmentIntent>) => void;
  onDeals: (deals: z.infer<typeof Deal>[]) => void;
  onMemo: (memo: z.infer<typeof InvestmentMemo>) => void;
}

const Deals = z.array(Deal);

function dispatch(event: string, data: string, handlers: CopilotStreamHandlers): void {
  if (!data) return;
  const json = deepCamel(JSON.parse(data));
  switch (event) {
    case 'intent':
      handlers.onIntent(InvestmentIntent.parse(json));
      break;
    case 'deals':
      handlers.onDeals(Deals.parse(json));
      break;
    case 'memo':
      handlers.onMemo(InvestmentMemo.parse(json));
      break;
    case 'error':
      throw new Error((json as { error?: string }).error ?? 'The agent returned an error.');
  }
}

/**
 * Stream the Copilot pipeline, invoking `handlers` as each stage (intent, deals,
 * memo) arrives over Server-Sent Events. Resolves when the stream completes;
 * rejects on transport errors or a terminal `error` event.
 */
export async function streamCopilot(
  message: string,
  handlers: CopilotStreamHandlers,
): Promise<void> {
  const res = await fetch('/api/copilot/stream', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok || !res.body) {
    let detail = `Request failed (${res.status})`;
    try {
      detail = ((await res.json()) as { error?: string }).error ?? detail;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let sep: number;
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      let event = 'message';
      let data = '';
      for (const line of frame.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data += line.slice(5).trim();
      }
      dispatch(event, data, handlers);
    }
  }
}
