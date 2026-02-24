'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppStateProvider } from '@/contexts/AppStateContext';
import { LoginScreen } from '@/components/Auth/LoginScreen';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TodoList } from '@/components/TodoList';
import { Notes } from '@/components/Notes';
import styles from './page.module.css';

function AppContent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return null;

  if (!user) return <LoginScreen />;

  const email = user.email ?? '';

  return (
    <AppStateProvider userId={user.id}>
      <main className={styles.main}>
        <div className={styles.meshBackground}>
          <div className={styles.meshOrb} />
        </div>

        <header className={styles.header}>
          <h1 className={styles.logo}>
            Vibe <span className={styles.logoAccent}>PM</span>
          </h1>

          <div className={styles.headerUser}>
            <div className={styles.avatarFallback}>{email.charAt(0).toUpperCase()}</div>
            <span className={styles.userName}>{email}</span>
            <button className={styles.signOutBtn} onClick={signOut}>
              Sign out
            </button>
          </div>
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

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
