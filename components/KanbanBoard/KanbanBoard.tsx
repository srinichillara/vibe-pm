'use client';

import { DndContext, DragEndEvent, DragOverEvent, closestCorners } from '@dnd-kit/core';
import { Task, ColumnId, ColumnDefinition } from '@/types';
import { generateId } from '@/lib/generateId';
import { useAppState } from '@/contexts/AppStateContext';
import Column from './Column';
import styles from './KanbanBoard.module.css';

const COLUMNS: ColumnDefinition[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'complete', title: 'Complete' },
];

export default function KanbanBoard() {
  const { tasks, setTasks: onTasksChange } = useAppState();
  const getTasksByColumn = (columnId: ColumnId) => {
    return tasks.filter((task) => task.column === columnId);
  };

  const handleAddTask = (columnId: ColumnId, title: string) => {
    const newTask: Task = {
      id: generateId('task'),
      title,
      column: columnId,
      createdAt: Date.now(),
    };
    onTasksChange([...tasks, newTask]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    onTasksChange(
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const handleDeleteTask = (id: string) => {
    onTasksChange(tasks.filter((task) => task.id !== id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    const overTask = tasks.find((t) => t.id === overId);

    let newColumn: ColumnId | null = null;

    if (isOverColumn) {
      newColumn = overId as ColumnId;
    } else if (overTask) {
      newColumn = overTask.column;
    }

    if (newColumn && newColumn !== activeTask.column) {
      onTasksChange(
        tasks.map((task) =>
          task.id === activeId ? { ...task, column: newColumn! } : task
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const isOverColumn = COLUMNS.some((col) => col.id === overId);

    if (isOverColumn) {
      const newColumn = overId as ColumnId;
      if (activeTask.column !== newColumn) {
        onTasksChange(
          tasks.map((task) =>
            task.id === activeId ? { ...task, column: newColumn } : task
          )
        );
      }
    }
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={getTasksByColumn(column.id)}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
    </DndContext>
  );
}
