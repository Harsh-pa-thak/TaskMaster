const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('taskmaster', {
  // Lists
  getLists: () => ipcRenderer.invoke('db:getLists'),
  createList: (name, color) => ipcRenderer.invoke('db:createList', name, color),
  deleteList: (id) => ipcRenderer.invoke('db:deleteList', id),
  updateList: (id, name, color) => ipcRenderer.invoke('db:updateList', id, name, color),

  // Tasks
  getTasks: (listId) => ipcRenderer.invoke('db:getTasks', listId),
  getAllTasks: () => ipcRenderer.invoke('db:getAllTasks'),
  createTask: (task) => ipcRenderer.invoke('db:createTask', task),
  updateTask: (id, updates) => ipcRenderer.invoke('db:updateTask', id, updates),
  deleteTask: (id) => ipcRenderer.invoke('db:deleteTask', id),
  completeTask: (id) => ipcRenderer.invoke('db:completeTask', id),

  // Window controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  openMain: () => ipcRenderer.send('window:openMain'),

  // Events from main
  onNotification: (cb) => ipcRenderer.on('notification', (_, data) => cb(data)),
  onTasksUpdated: (cb) => ipcRenderer.on('tasks:updated', () => cb()),
})
