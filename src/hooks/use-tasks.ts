'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskStatus } from '@/lib/types';

const TASKS_STORAGE_KEY = 'agentflow-tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks to localStorage', error);
      }
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((description: string, isUrgent: boolean, isImportant: boolean) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      description,
      isUrgent,
      isImportant,
      status: 'todo',
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  return { tasks, addTask, updateTask, deleteTask, isLoaded };
}
