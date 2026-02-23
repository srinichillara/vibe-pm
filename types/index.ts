export type ColumnId = 'todo' | 'in-progress' | 'complete';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; order: number }> = {
  critical: { label: 'Critical', color: '#ef4444', order: 0 },
  high: { label: 'High', color: '#f97316', order: 1 },
  medium: { label: 'Medium', color: '#eab308', order: 2 },
  low: { label: 'Low', color: '#3b82f6', order: 3 },
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  column: ColumnId;
  priority?: Priority;
  dueDate?: string;
  createdAt: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AppState {
  tasks: Task[];
  todos: TodoItem[];
  notes: string;
}

export interface ColumnDefinition {
  id: ColumnId;
  title: string;
}
