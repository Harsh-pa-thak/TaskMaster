const isElectron = typeof window !== 'undefined' && Boolean(window.taskmaster)

const listeners = new Set()

const mockStorage = {
  getLists: () => JSON.parse(localStorage.getItem('tm_lists') || '[{"id":1,"name":"My Tasks","color":"#6366f1"}]'),
  saveLists: (lists) => localStorage.setItem('tm_lists', JSON.stringify(lists)),
  getTasks: () => JSON.parse(localStorage.getItem('tm_tasks') || '[]'),
  saveTasks: (tasks) => localStorage.setItem('tm_tasks', JSON.stringify(tasks)),
}

const mockApi = {
  getLists: async () => mockStorage.getLists(),
  createList: async (name, color = '#6366f1') => {
    const lists = mockStorage.getLists()
    const newList = { id: Date.now(), name, color }
    lists.push(newList)
    mockStorage.saveLists(lists)
    listeners.forEach((cb) => cb())
    return newList
  },
  deleteList: async (id) => {
    const lists = mockStorage.getLists().filter((l) => l.id !== id)
    mockStorage.saveLists(lists)
    listeners.forEach((cb) => cb())
  },
  updateList: async (id, name, color) => {
    const lists = mockStorage.getLists().map((l) => (l.id === id ? { ...l, name, color } : l))
    mockStorage.saveLists(lists)
    listeners.forEach((cb) => cb())
  },
  getTasks: async (listId) => {
    return mockStorage.getTasks().filter((t) => t.list_id === listId)
  },
  getAllTasks: async () => mockStorage.getTasks(),
  createTask: async (task) => {
    const tasks = mockStorage.getTasks()
    const newTask = {
      id: Date.now(),
      list_id: task.list_id,
      title: task.title,
      notes: task.notes || null,
      due_date: task.due_date || null,
      recurrence: task.recurrence || null,
      is_completed: 0,
      created_at: new Date().toISOString(),
    }
    tasks.push(newTask)
    mockStorage.saveTasks(tasks)
    listeners.forEach((cb) => cb())
    return newTask
  },
  updateTask: async (id, updates) => {
    const tasks = mockStorage.getTasks().map((t) => (t.id === id ? { ...t, ...updates } : t))
    mockStorage.saveTasks(tasks)
    listeners.forEach((cb) => cb())
  },
  deleteTask: async (id) => {
    const tasks = mockStorage.getTasks().filter((t) => t.id !== id)
    mockStorage.saveTasks(tasks)
    listeners.forEach((cb) => cb())
  },
  completeTask: async (id) => {
    const tasks = mockStorage.getTasks().map((t) => (t.id === id ? { ...t, is_completed: 1 } : t))
    mockStorage.saveTasks(tasks)
    listeners.forEach((cb) => cb())
  },
  minimizeWindow: () => {},
  maximizeWindow: () => {},
  closeWindow: () => {},
  openMain: () => {},
  onNotification: () => {},
  onTasksUpdated: (cb) => {
    listeners.add(cb)
    return () => listeners.delete(cb)
  },
}

export const api = isElectron ? window.taskmaster : mockApi
export default api
