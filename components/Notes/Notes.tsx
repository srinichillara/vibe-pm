'use client';

import { useAppState } from '@/contexts/AppStateContext';
import styles from './Notes.module.css';

export default function Notes() {
  const { notes, setNotes } = useAppState();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Notes</span>
      </div>

      <div className={styles.content}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={styles.textarea}
          placeholder="jot something down..."
        />
        <span className={styles.charCount}>{notes.length}</span>
      </div>
    </div>
  );
}
