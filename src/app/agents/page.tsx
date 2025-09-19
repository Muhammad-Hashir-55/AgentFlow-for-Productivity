'use client';

import { Header } from '@/components/header';
import { AgentManager } from '@/components/agent-manager';

export default function AgentsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* The header doesn't need the onNewTaskClick on this page, but we can reuse it for layout consistency */}
      <Header onNewTaskClick={() => {}} /> 
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <AgentManager />
      </main>
    </div>
  );
}
