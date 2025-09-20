// src/ai/flows/agent-suggestion.ts
'use server';
/**
 * Suggest an agent from local agents first; if none matches, fallback to a site:agent.ai search URL.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit'; // keep if you still want to use ai elsewhere
// IMPORT initialAgents from your lib/data.ts
// If you use TS path alias @ for project root (nextjs typical), use:
import { initialAgents } from '@/lib/data';

// If you don't use path aliases, use a relative path instead (uncomment if needed):
// import { initialAgents } from '../../../lib/data';

const SuggestAgentInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be completed.'),
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

/**
 * Simple scoring: looks for tokens from the taskDescription inside agent.name, agent.description, agent.url.
 * Returns highest scoring agent if any match exists.
 */
function scoreAndPickAgent(taskDescription: string) {
  const text = taskDescription.toLowerCase();
  // tokens from description (simple split, could be improved)
  const tokens = Array.from(new Set(text.split(/[\s,.;:()?]+/).filter(Boolean)));

  let best = { agent: null as (typeof initialAgents)[0] | null, score: 0 };

  for (const agent of initialAgents) {
    const hay = (agent.name + ' ' + agent.description + ' ' + agent.url).toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (t.length < 3) continue; // ignore very short tokens
      if (hay.includes(t)) score += 2; // strong match
      // partial match
      else if (hay.split(/\W+/).some(w => w.startsWith(t) && t.length >= 3)) score += 1;
    }

    // small boost for phrase matches (e.g., "image", "code", "blog")
    if (text.includes('image') && hay.includes('image')) score += 2;
    if (text.includes('code') && (hay.includes('code') || hay.includes('replit'))) score += 2;
    if (text.includes('blog') && hay.includes('blog')) score += 2;

    if (score > best.score) best = { agent, score };
  }

  return best;
}

const suggestAgentFlow = ai.defineFlow(
  {
    name: 'suggestAgentFlow',
    inputSchema: SuggestAgentInputSchema,
    outputSchema: SuggestAgentOutputSchema,
  },
  async input => {
    const { taskDescription } = input;

    // 1) Try local agents first
    const best = scoreAndPickAgent(taskDescription);

    if (best.agent && best.score > 0) {
      const reasoning = `Selected local agent "${best.agent.name}" (score=${best.score}) because its name/description/url contain terms matching the task ("${taskDescription.slice(0, 80)}...").`;
      return {
        suggestedAgentUrl: best.agent.url,
        reasoning,
      };
    }

    // 2) Fallback: construct a site:agent.ai google search URL
    const query = `site:agent.ai ${taskDescription}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    const reasoning = `No suitable local agent matched the task description. Fallback recommended: search across agent.ai using site:agent.ai + your task description.`;
    return {
      suggestedAgentUrl: googleSearchUrl,
      reasoning,
    };
  }
);
