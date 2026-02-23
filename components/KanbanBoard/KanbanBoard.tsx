'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, closestCorners } from '@dnd-kit/core';
import { Task, ColumnId, ColumnDefinition, Priority, PRIORITY_CONFIG } from '@/types';
import { generateId } from '@/lib/generateId';
import { useAppState } from '@/contexts/AppStateContext';
import Column from './Column';
import styles from './KanbanBoard.module.css';

const COLUMNS: ColumnDefinition[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'complete', title: 'Complete' },
];

const FILTER_OPTIONS: Array<{ value: Priority | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function KanbanBoard() {
  const { tasks, setTasks: onTasksChange } = useAppState();
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');

  const getTasksByColumn = (columnId: ColumnId) => {
    return tasks
      .filter((task) => task.column === columnId)
      .filter((task) => filterPriority === 'all' || task.priority === filterPriority)
      .sort((a, b) => {
        const aOrder = a.priority !== undefined ? PRIORITY_CONFIG[a.priority].order : 99;
        const bOrder = b.priority !== undefined ? PRIORITY_CONFIG[b.priority].order : 99;
        return aOrder - bOrder;
      });
  };

  const handleAddTask = (columnId: ColumnId, title: string, priority?: Priority) => {
    const newTask: Task = {
      id: generateId('task'),
      title,
      column: columnId,
      priority,
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
    <div className={styles.wrapper}>
      <div className={styles.filterBar}>
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.filterBtn} ${filterPriority === value ? styles.filterBtnActive : ''}`}
            style={
              value !== 'all'
                ? ({ '--filter-color': PRIORITY_CONFIG[value as Priority].color } as React.CSSProperties)
                : undefined
            }
            onClick={() => setFilterPriority(value)}
          >
            {value !== 'all' && <span className={styles.filterDot} />}
            {label}
          </button>
        ))}
      </div>
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
    </div>
  );
}
