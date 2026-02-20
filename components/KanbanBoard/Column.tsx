'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task, ColumnId } from '@/types';
import TaskCard from './TaskCard';
import styles from './Column.module.css';

interface ColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onAddTask: (columnId: ColumnId, title: string) => void;
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

  const { setNodeRef, isOver } = useDroppable({ id });

  const handleAddSubmit = () => {
    if (newTaskTitle.trim()) {
      onAddTask(id, newTaskTitle.trim());
      setNewTaskTitle('');
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
      ) : (
        <button className={styles.addButton} onClick={() => setIsAdding(true)}>
          <Plus />
          <span>Add task</span>
        </button>
      )}
    </div>
  );
}
