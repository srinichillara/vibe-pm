'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import { Task } from '@/types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
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
        </div>
      )}

      {!isExpanded && task.description && (
        <p className={styles.expandHint}>click to expand</p>
      )}
    </div>
  );
}
