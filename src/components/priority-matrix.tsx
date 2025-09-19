'use client';

import type { Task } from '@/lib/types';
import { TaskCard } from './task-card';

type PriorityMatrixProps = {
  tasks: Task[];
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id:string) => void;
};

const Quadrant = ({ title, tasks, ...props }: { title: string; tasks: Task[] } & PriorityMatrixProps) => (
  <div className="flex flex-col gap-4 rounded-lg bg-card p-4 shadow-sm">
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    <div className="flex-1 space-y-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} updateTask={props.updateTask} deleteTask={props.deleteTask} />
        ))
      ) : (
        <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-border">
          <p className="text-sm text-muted-foreground">No tasks here.</p>
        </div>
      )}
    </div>
  </div>
);

export function PriorityMatrix({ tasks, updateTask, deleteTask }: PriorityMatrixProps) {
  const importantUrgent = tasks.filter(t => t.isImportant && t.isUrgent);
  const importantNotUrgent = tasks.filter(t => t.isImportant && !t.isUrgent);
  const notImportantUrgent = tasks.filter(t => !t.isImportant && t.isUrgent);
  const notImportantNotUrgent = tasks.filter(t => !t.isImportant && !t.isUrgent);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
      <Quadrant title="Urgent & Important" tasks={importantUrgent} updateTask={updateTask} deleteTask={deleteTask} />
      <Quadrant title="Important, Not Urgent" tasks={importantNotUrgent} updateTask={updateTask} deleteTask={deleteTask} />
      <Quadrant title="Urgent, Not Important" tasks={notImportantUrgent} updateTask={updateTask} deleteTask={deleteTask} />
      <Quadrant title="Not Urgent, Not Important" tasks={notImportantNotUrgent} updateTask={updateTask} deleteTask={deleteTask} />
    </div>
  );
}
