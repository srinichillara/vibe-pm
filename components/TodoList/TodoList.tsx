'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { TodoItem } from '@/types';
import { generateId } from '@/lib/generateId';
import { useAppState } from '@/contexts/AppStateContext';
import styles from './TodoList.module.css';

export default function TodoList() {
  const { todos, setTodos: onTodosChange } = useAppState();
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: generateId('todo'),
      text: newTodoText.trim(),
      completed: false,
    };

    onTodosChange([...todos, newTodo]);
    setNewTodoText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTodo();
    }
  };

  const handleToggle = (id: string) => {
    onTodosChange(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    onTodosChange(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Quick Tasks</span>
      </div>

      <div className={styles.list}>
        {todos.length === 0 ? (
          <p className={styles.empty}>no tasks yet</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className={styles.item}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
                className={styles.checkbox}
              />
              <span
                className={`${styles.itemText} ${todo.completed ? styles.completed : ''}`}
              >
                {todo.text}
              </span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(todo.id)}
                aria-label="Delete todo"
              >
                <X />
              </button>
            </div>
          ))
        )}
      </div>

      <div className={styles.addForm}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.addInput}
          placeholder="add a task..."
        />
      </div>
    </div>
  );
}
