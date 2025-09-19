'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Plus, NotebookText } from 'lucide-react';
import { Separator } from './ui/separator';

type HeaderProps = {
  onNewTaskClick: () => void;
};

export function Header({ onNewTaskClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">AgentFlow</h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/agents">
              <NotebookText className="h-4 w-4" />
              <span className="hidden sm:inline-block">Manage Agents</span>
            </Link>
          </Button>
          <Button onClick={onNewTaskClick}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline-block">New Task</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
