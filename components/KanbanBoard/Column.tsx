'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task, ColumnId, Priority, PRIORITY_CONFIG } from '@/types';
import TaskCard from './TaskCard';
import styles from './Column.module.css';

interface ColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onAddTask: (columnId: ColumnId, title: string, priority?: Priority) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function Column({
  id,
  title,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority | undefined>(undefined);

  const { setNodeRef, isOver } = useDroppable({ id });

  const handleAddSubmit = () => {
    if (newTaskTitle.trim()) {
      onAddTask(id, newTaskTitle.trim(), newTaskPriority);
      setNewTaskTitle('');
      setNewTaskPriority(undefined);
    }
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubmit();
    }
    if (e.key === 'Escape') {
      setNewTaskTitle('');
      setNewTaskPriority(undefined);
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnTitle}>{title}</span>
        <span className={styles.columnCount}>{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`${styles.columnContent} ${isOver ? styles.dragOver : ''}`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 && !isOver && (
            <p className={styles.emptyState}>no tasks yet</p>
          )}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>

      {isAdding ? (
        <div className={styles.addForm}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onBlur={handleAddSubmit}
            onKeyDown={handleKeyDown}
            className={styles.addInput}
            placeholder="task title..."
            autoFocus
          />
          <div className={styles.priorityRow}>
            {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
              <button
                key={p}
                className={`${styles.priorityPill} ${newTaskPriority === p ? styles.priorityPillActive : ''}`}
                style={{ '--priority-color': PRIORITY_CONFIG[p].color } as React.CSSProperties}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setNewTaskPriority(newTaskPriority === p ? undefined : p)}
                type="button"
              >
                {PRIORITY_CONFIG[p].label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button className={styles.addButton} onClick={() => setIsAdding(true)}>
          <Plus />
          <span>Add task</span>
        </button>
      )}
    </div>
  );
}
