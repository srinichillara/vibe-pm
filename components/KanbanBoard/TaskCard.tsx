'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Calendar } from 'lucide-react';
import { Task, Priority, PRIORITY_CONFIG } from '@/types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(task.priority ? { borderLeft: `3px solid ${PRIORITY_CONFIG[task.priority].color}` } : {}),
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    }
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditingTitle(false);
    }
  };

  const handleDescriptionBlur = () => {
    if (editDescription !== task.description) {
      onUpdate(task.id, { description: editDescription || undefined });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''} ${isExpanded ? styles.expanded : ''}`}
      onClick={handleCardClick}
      {...attributes}
      {...(isExpanded ? {} : listeners)}
    >
      <div className={styles.cardHeader}>
        {isEditingTitle ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className={styles.cardTitleInput}
            autoFocus
          />
        ) : (
          <span
            className={styles.cardTitle}
            onDoubleClick={() => setIsEditingTitle(true)}
          >
            {task.title}
          </span>
        )}
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          aria-label="Delete task"
        >
          <X />
        </button>
      </div>

      {!isExpanded && (task.priority || task.dueDate) && (
        <div className={styles.cardMeta}>
          {task.priority && (
            <span
              className={styles.priorityBadge}
              style={{ '--priority-color': PRIORITY_CONFIG[task.priority].color } as React.CSSProperties}
            >
              {PRIORITY_CONFIG[task.priority].label}
            </span>
          )}
          {task.dueDate && (
            <span className={`${styles.dueDateBadge} ${isOverdue(task.dueDate) ? styles.overdue : ''}`}>
              <Calendar style={{ width: 10, height: 10 }} />
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      )}

      {isExpanded && (
        <div className={styles.cardDescription}>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            className={styles.descriptionInput}
            placeholder="add a description..."
            onClick={(e) => e.stopPropagation()}
          />
          <div className={styles.expandedMeta}>
            <div className={styles.metaSection}>
              <span className={styles.metaLabel}>Priority</span>
              <div className={styles.priorityOptions}>
                {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                  <button
                    key={p}
                    className={`${styles.priorityOption} ${task.priority === p ? styles.priorityOptionActive : ''}`}
                    style={{ '--priority-color': PRIORITY_CONFIG[p].color } as React.CSSProperties}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate(task.id, { priority: task.priority === p ? undefined : p });
                    }}
                  >
                    {PRIORITY_CONFIG[p].label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.metaSection}>
              <span className={styles.metaLabel}>Due date</span>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => {
                  onUpdate(task.id, { dueDate: e.target.value || undefined });
                }}
                onClick={(e) => e.stopPropagation()}
                className={styles.dueDateInput}
              />
            </div>
          </div>
        </div>
      )}

      {!isExpanded && task.description && (
        <p className={styles.expandHint}>click to expand</p>
      )}
    </div>
  );
}
