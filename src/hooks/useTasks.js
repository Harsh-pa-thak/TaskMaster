import { useState, useEffect, useCallback } from 'react';

const api = window.taskmaster;

export function useTasks(listId) {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);

  const loadTasks = useCallback(async () => {
    if (!listId) return;
    const data = await api.getTasks(listId);
    setTasks(data);
  }, [listId]);

  useEffect(() => {
    loadTasks();
    api.getLists().then(setLists);
    
    const cleanup = api.onTasksUpdated(loadTasks);
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [loadTasks]);

  const createTask = async (taskData) => {
    await api.createTask(taskData);
    loadTasks();
  };

  const pending = tasks.filter((t) => !t.is_completed);
  const completed = tasks.filter((t) => t.is_completed);

  return {
    tasks,
    pending,
    completed,
    lists,
    createTask,
    refreshTasks: loadTasks,
  };
}
