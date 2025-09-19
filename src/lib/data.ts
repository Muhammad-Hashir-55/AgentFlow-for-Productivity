import type { Agent } from './types';

export const initialAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Blog Post Writer',
    url: 'https://lablab.ai/apps/blog-post-writer',
    description: 'Generates a complete blog post from a title.',
  },
  {
    id: 'agent-2',
    name: 'Image Generator',
    url: 'https://lablab.ai/apps/image-generator',
    description: 'Creates an image from a text prompt.',
  },
  {
    id: 'agent-3',
    name: 'Code Assistant',
    url: 'https://lablab.ai/apps/code-assistant',
    description: 'Helps with writing and debugging code.',
  },
  {
    id: 'agent-4',
    name: 'Social Media Post Generator',
    url: 'https://lablab.ai/apps/social-media-post-generator',
    description: 'Creates engaging posts for social media.',
  },
];
