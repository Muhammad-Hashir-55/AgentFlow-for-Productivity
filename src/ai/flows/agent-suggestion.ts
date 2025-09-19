// src/ai/flows/agent-suggestion.ts
'use server';
/**
 * @fileOverview A flow to suggest an appropriate agent (tool URL) for completing a task based on the task description.
 *
 * - suggestAgent - A function that suggests an agent for a given task description.
 * - SuggestAgentInput - The input type for the suggestAgent function.
 * - SuggestAgentOutput - The return type for the suggestAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const prompt = ai.definePrompt({
  name: 'suggestAgentPrompt',
  input: {schema: SuggestAgentInputSchema},
  output: {schema: SuggestAgentOutputSchema},
  prompt: `You are an AI assistant that suggests appropriate agents (tool URLs) for completing tasks based on the task description.

  Given the following task description, suggest any better tool you know simple google open like site:agent.ai 'query thing like eggs refer to grocery and code refers to replit etc. etc. for other stuff' that can be used to complete the task.
  Also provide a brief reasoning for your suggestion.

  Task Description: {{{taskDescription}}}
  `,
});

const suggestAgentFlow = ai.defineFlow(
  {
    name: 'suggestAgentFlow',
    inputSchema: SuggestAgentInputSchema,
    outputSchema: SuggestAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
