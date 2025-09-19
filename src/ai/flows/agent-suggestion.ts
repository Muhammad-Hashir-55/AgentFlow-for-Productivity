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
  // List of currently available/pre-added agents (pass from client)
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
- A list of PRE-ADDED AGENTS the user currently has access to. Each agent has name, url, and optional description:

{{#each agents}}
- {{this.name}} — {{this.url}}{{#if this.description}} — {{this.description}}{{/if}}
{{/each}}

INSTRUCTIONS:
1. FIRST try to choose the best match from the PRE-ADDED AGENTS above. If a pre-added agent is suitable, return that agent's exact URL as suggestedAgentUrl.
2. If none of the pre-added agents are suitable, produce a reliable external suggestion by forming a Google search URL that searches Agent.ai for relevant agents. Use the format:
   https://www.google.com/search?q=<encoded site:agent.ai + query>
   where <query> is a short useful query derived from the task description (e.g., site:agent.ai "video generator" or site:agent.ai "summarize text").
3. Always include a short reasoning field explaining why you selected that URL, and explicitly say whether the returned URL is from the user's existing list or is a google search fallback.
4. Do NOT return any internal IDs or extra fields — only suggestedAgentUrl and reasoning.

Return JSON matching the output schema exactly.
`,
});

const suggestAgentFlow = ai.defineFlow(
  {
    name: 'suggestAgentFlow',
    inputSchema: SuggestAgentInputSchema,
    outputSchema: SuggestAgentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
