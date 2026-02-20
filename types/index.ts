export type ColumnId = 'todo' | 'in-progress' | 'complete';

export interface Task {
  id: string;
  title: string;
  description?: string;
  column: ColumnId;
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
