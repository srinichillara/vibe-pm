'use client';

import { AppStateProvider } from '@/contexts/AppStateContext';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TodoList } from '@/components/TodoList';
import { Notes } from '@/components/Notes';
import styles from './page.module.css';

export default function Home() {
  return (
    <AppStateProvider>
      <main className={styles.main}>
        {/* Animated gradient mesh background */}
        <div className={styles.meshBackground}>
          <div className={styles.meshOrb} />
        </div>

        <header className={styles.header}>
          <h1 className={styles.logo}>
            Vibe <span className={styles.logoAccent}>PM</span>
          </h1>
        </header>

        <div className={styles.content}>
          <section className={styles.boardSection}>
            <KanbanBoard />
          </section>

          <aside className={styles.sidebar}>
            <TodoList />
            <Notes />
          </aside>
        </div>
      </main>
    </AppStateProvider>
  );
}
