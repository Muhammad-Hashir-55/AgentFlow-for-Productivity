'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { PriorityMatrix } from '@/components/priority-matrix';
import { AddTaskDialog } from '@/components/add-task-dialog';
import { useTasks } from '@/hooks/use-tasks';

export default function DashboardPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header onNewTaskClick={() => setIsDialogOpen(true)} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <PriorityMatrix
          tasks={tasks}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
      </main>
      <AddTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        addTask={addTask}
      />
    </div>
  );
}
