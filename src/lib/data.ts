import type { Agent } from './types';

export const initialAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Blog Post Repurposer',
    url: 'https://agent.ai/profile/Blog-Post-Repurposer',
    description: 'Generates a complete blog post from a title.',
  },
  {
    id: 'agent-2',
    name: 'Image Generator',
    url: 'https://agent.ai/profile/gpt-image-generation',
    description: 'Creates an image from a text prompt.',
  },
  {
    id: 'agent-3',
    name: 'Code Assistant',
    url: 'https://replit.com/ai',
    description: 'Helps with writing and debugging code.',
  },
];
