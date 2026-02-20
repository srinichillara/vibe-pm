'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task, TodoItem } from '@/types';

interface AppStateContextType {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  todos: TodoItem[];
  setTodos: (todos: TodoItem[] | ((prev: TodoItem[]) => TodoItem[])) => void;
  notes: string;
  setNotes: (notes: string | ((prev: string) => string)) => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('vibe-pm-tasks', []);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('vibe-pm-todos', []);
  const [notes, setNotes] = useLocalStorage<string>('vibe-pm-notes', '');

  return (
    <AppStateContext.Provider value={{ tasks, setTasks, todos, setTodos, notes, setNotes }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextType {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
