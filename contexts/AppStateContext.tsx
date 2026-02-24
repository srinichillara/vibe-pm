'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task, TodoItem } from '@/types';
import { supabase } from '@/lib/supabase';

interface AppStateContextType {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  todos: TodoItem[];
  setTodos: (todos: TodoItem[] | ((prev: TodoItem[]) => TodoItem[])) => void;
  notes: string;
  setNotes: (notes: string | ((prev: string) => string)) => void;
}

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  task_column: string;
  priority: string | null;
  due_date: string | null;
  created_at: number;
  user_id: string;
}

function toRow(task: Task, userId: string): TaskRow {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? null,
    task_column: task.column,
    priority: task.priority ?? null,
    due_date: task.dueDate ?? null,
    created_at: task.createdAt,
    user_id: userId,
  };
}

function fromRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    column: row.task_column as Task['column'],
    priority: row.priority as Task['priority'] ?? undefined,
    dueDate: row.due_date ?? undefined,
    createdAt: row.created_at,
  };
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children, userId }: { children: ReactNode; userId: string }) {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('vibe-pm-todos', []);
  const [notes, setNotes] = useLocalStorage<string>('vibe-pm-notes', '');

  useEffect(() => {
    supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading tasks:', error);
          return;
        }
        if (data) setTasksState(data.map(fromRow));
      });
  }, [userId]);

  const setTasks = useCallback((value: Task[] | ((prev: Task[]) => Task[])) => {
    setTasksState(prev => {
      const next = value instanceof Function ? value(prev) : value;

      const prevMap = new Map(prev.map(t => [t.id, t]));
      const nextMap = new Map(next.map(t => [t.id, t]));

      const toUpsert = next.filter(t => {
        const old = prevMap.get(t.id);
        return !old || JSON.stringify(old) !== JSON.stringify(t);
      });

      const toDelete = prev.filter(t => !nextMap.has(t.id));

      if (toUpsert.length > 0) {
        supabase.from('tasks').upsert(toUpsert.map(t => toRow(t, userId))).then(({ error }) => {
          if (error) console.error('Error saving tasks:', error);
        });
      }

      if (toDelete.length > 0) {
        supabase.from('tasks').delete().in('id', toDelete.map(t => t.id)).then(({ error }) => {
          if (error) console.error('Error deleting tasks:', error);
        });
      }

      return next;
    });
  }, [userId]);

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
