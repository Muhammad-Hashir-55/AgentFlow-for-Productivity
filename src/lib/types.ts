export type TaskStatus = 'todo' | 'inprogress' | 'done';

export type Task = {
  id: string;
  description: string;
  isUrgent: boolean;
  isImportant: boolean;
  status: TaskStatus;
  suggestedAgentUrl?: string;
  agentReasoning?: string;
};

export type Quadrant = 'important-urgent' | 'important-not-urgent' | 'not-important-urgent' | 'not-important-not-urgent';

export type Agent = {
  id: string;
  name: string;
  url: string;
  description: string;
};
