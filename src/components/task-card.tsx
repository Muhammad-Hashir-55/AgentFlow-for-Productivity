'use client';

import { useState } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAgentSuggestion } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, Bot, Check, Circle, Ellipsis, Loader2, Trash2, Wand2 } from 'lucide-react';

type TaskCardProps = {
  task: Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
};

const statusMap: Record<TaskStatus, { label: string; icon: React.ReactNode; color: string }> = {
  todo: { label: 'To Do', icon: <Circle className="mr-2 h-4 w-4" />, color: 'bg-gray-500' },
  inprogress: { label: 'In Progress', icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />, color: 'bg-blue-500' },
  done: { label: 'Completed', icon: <Check className="mr-2 h-4 w-4" />, color: 'bg-green-500' },
};

export function TaskCard({ task, updateTask, deleteTask }: TaskCardProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = (status: TaskStatus) => {
    updateTask(task.id, { status });
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
    toast({ title: 'Task removed' });
  };

  const handleSuggestAgent = async () => {
    setIsSuggesting(true);
    try {
      const result = await getAgentSuggestion({ taskDescription: task.description });
      updateTask(task.id, {
        suggestedAgentUrl: result.suggestedAgentUrl,
        agentReasoning: result.reasoning,
      });
      toast({
        title: 'Agent Suggested!',
        description: 'An AI agent has been suggested for this task.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Suggestion Failed',
        description: 'Could not get an agent suggestion at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium leading-tight pr-4">{task.description}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleStatusChange('todo')}>To Do</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('inprogress')}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('done')}>Completed</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.suggestedAgentUrl ? (
          <div className="rounded-md border bg-muted/50 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Bot className="h-5 w-5 text-primary" />
              <span>Agent Suggestion</span>
            </div>
            <p className="mt-2 text-muted-foreground">{task.agentReasoning}</p>
            <Button size="sm" variant="link" asChild className="p-0 h-auto mt-2">
              <a href={task.suggestedAgentUrl} target="_blank" rel="noopener noreferrer">
                Go to Agent <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : (
          <Button onClick={handleSuggestAgent} disabled={isSuggesting} className="w-full">
            {isSuggesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Suggest an Agent
          </Button>
        )}
      </CardContent>
      <CardFooter>
         <Badge variant={task.status === 'done' ? 'default' : 'secondary'} className={task.status === 'done' ? `bg-accent text-accent-foreground` : ''}>
           {statusMap[task.status].label}
         </Badge>
      </CardFooter>
    </Card>
  );
}
