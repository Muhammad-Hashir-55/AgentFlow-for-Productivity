'use server';
/**
 * suggestAgentFlow — now accepts the current list of agents so the LLM can choose
 * from existing agents first, or fall back to a site:agent.ai google search if none match.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
});
export type Agent = z.infer<typeof AgentSchema>;

const SuggestAgentInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be completed.'),
  agents: z.array(AgentSchema).describe('List of agents available to choose from.'),
});
export type SuggestAgentInput = z.infer<typeof SuggestAgentInputSchema>;

const SuggestAgentOutputSchema = z.object({
  suggestedAgentUrl: z.string().url().describe('The URL of the suggested agent for completing the task.'),
  reasoning: z.string().describe('The reasoning behind the agent suggestion.'),
});
export type SuggestAgentOutput = z.infer<typeof SuggestAgentOutputSchema>;

export async function suggestAgent(input: SuggestAgentInput): Promise<SuggestAgentOutput> {
  return suggestAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAgentPrompt',
  input: { schema: SuggestAgentInputSchema },
  output: { schema: SuggestAgentOutputSchema },
  prompt: `You are an AI assistant that suggests appropriate agents (tool URLs) for completing tasks.

You are given:
- A task description: {{{taskDescription}}}
- A list of PRE-ADDED AGENTS the user currently has access to:

{{#each agents}}
- {{this.name}} — {{this.url}}{{#if this.description}} — {{this.description}}{{/if}}
{{/each}}

INSTRUCTIONS:
1. Prefer an existing agent if suitable (return its URL).
2. Otherwise suggest a Google search with site:agent.ai + query.
3. Always include reasoning.
4. Output only { suggestedAgentUrl, reasoning }.
`,
});

const suggestAgentFlow = ai.defineFlow(
  {
    name: 'suggestAgentFlow',
    inputSchema: SuggestAgentInputSchema,
    outputSchema: SuggestAgentOutputSchema,
  },
  async (input) => {
    // try prompt.run — commonly provided by genkit prompt objects
    // if ai.generate exists at runtime but types don't include it
    const result = await (ai as any).generate(prompt, input);
    return result;
  }
);


