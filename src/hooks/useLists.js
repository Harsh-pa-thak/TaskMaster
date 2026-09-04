import { useState, useEffect, useCallback } from 'react';

const api = window.taskmaster;

export function useLists() {
  const [lists, setLists] = useState([]);
  const [activeList, setActiveList] = useState(null);

  const loadLists = useCallback(async () => {
    const data = await api.getLists();
    setLists(data);
    
    // Maintain active list selection if possible
    setActiveList((currentActive) => {
      if (!currentActive && data.length > 0) return data[0];
      if (currentActive) {
        const stillExists = data.find((l) => l.id === currentActive.id);
        if (stillExists) return stillExists;
        return data.length > 0 ? data[0] : null;
      }
      return null;
    });
  }, []);

  useEffect(() => {
    loadLists();
    const cleanup = api.onTasksUpdated(() => loadLists());
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [loadLists]);

  const handleCreateList = async (name, color) => {
    const newList = await api.createList(name, color);
    setLists((prev) => [...prev, newList]);
    setActiveList(newList);
  };

  const handleDeleteList = async (id) => {
    await api.deleteList(id);
    setLists((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      setActiveList((current) => (current?.id === id ? updated[0] || null : current));
      return updated;
    });
  };

  return {
    lists,
    activeList,
    setActiveList,
    createList: handleCreateList,
    deleteList: handleDeleteList,
  };
}
