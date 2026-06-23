import { Deal, InvestmentIntent, InvestmentMemo } from '@fractionax/domain';
import { z } from 'zod';

/** The Copilot's structured response, composed from the shared domain schemas.
 * Mirrors the agents service's `CopilotResult` (after camelCase transform). */
export const CopilotResponse = z.object({
  intent: InvestmentIntent,
  deals: z.array(Deal),
  memo: InvestmentMemo.nullish(),
});
export type CopilotResponse = z.infer<typeof CopilotResponse>;
