'use server';

import { suggestAgent, type SuggestAgentInput, type SuggestAgentOutput } from '@/ai/flows/agent-suggestion';
import { z } from 'zod';

const inputSchema = z.object({
  taskDescription: z.string(),
});

export async function getAgentSuggestion(input: SuggestAgentInput): Promise<SuggestAgentOutput> {
  const parsedInput = inputSchema.parse(input);
  try {
    const output = await suggestAgent(parsedInput);
    return output;
  } catch (error) {
    console.error('Error in suggestAgent flow:', error);
    throw new Error('Failed to get agent suggestion.');
  }
}
