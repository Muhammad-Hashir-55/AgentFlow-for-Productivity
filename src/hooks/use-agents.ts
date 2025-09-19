'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Agent } from '@/lib/types';
import { initialAgents } from '@/lib/data';

const AGENTS_STORAGE_KEY = 'agentflow-agents';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
      if (storedAgents) {
        setAgents(JSON.parse(storedAgents));
      } else {
        setAgents(initialAgents);
      }
    } catch (error) {
      console.error('Failed to load agents from localStorage', error);
      setAgents(initialAgents);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
      } catch (error) {
        console.error('Failed to save agents to localStorage', error);
      }
    }
  }, [agents, isLoaded]);

  const addAgent = useCallback((name: string, url: string, description: string) => {
    const newAgent: Agent = {
      id: crypto.randomUUID(),
      name,
      url,
      description,
    };
    setAgents(prevAgents => [newAgent, ...prevAgents]);
  }, []);

  const deleteAgent = useCallback((id: string) => {
    setAgents(prevAgents => prevAgents.filter(agent => agent.id !== id));
  }, []);

  return { agents, addAgent, deleteAgent, isLoaded };
}
