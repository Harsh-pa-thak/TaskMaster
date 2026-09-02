const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
  shell,
} = require('electron')
const path = require('path')
const db = require('./db')
const { startScheduler, stopScheduler } = require('./scheduler')

const isDev = process.env.NODE_ENV === 'development'

let mainWindow = null
let widgetWindow = null
let tray = null

// ── Window Factories ────────────────────────────────────────────────────────

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 700,
    minHeight: 500,
    frame: false,
    transparent: false,
    backgroundColor: '#0f0f14',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false,
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => mainWindow.show())

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createWidgetWindow() {
  const { screen } = require('electron')
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  widgetWindow = new BrowserWindow({
    width: 320,
    height: 520,
    x: width - 340,
    y: height - 560,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  })

  if (isDev) {
    widgetWindow.loadURL('http://localhost:5173/widget.html')
  } else {
    widgetWindow.loadFile(path.join(__dirname, '../dist/widget.html'))
  }

  widgetWindow.once('ready-to-show', () => widgetWindow.show())

  widgetWindow.on('closed', () => {
    widgetWindow = null
  })
}

// ── Tray ────────────────────────────────────────────────────────────────────

function createTray() {
  const iconPath = path.join(__dirname, '../assets/tray-icon.png')
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })
  tray = new Tray(icon)
  tray.setToolTip('TaskMaster')

  function buildMenu() {
    return Menu.buildFromTemplate([
      {
        label: 'Open TaskMaster',
        click: () => {
          if (!mainWindow) createMainWindow()
          else { mainWindow.show(); mainWindow.focus() }
        },
      },
      {
        label: widgetWindow ? 'Hide Widget' : 'Show Widget',
        click: () => {
          if (widgetWindow) {
            widgetWindow.close()
            widgetWindow = null
          } else {
            createWidgetWindow()
          }
          tray.setContextMenu(buildMenu())
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => app.quit(),
      },
    ])
  }

  tray.setContextMenu(buildMenu())

  tray.on('click', () => {
    if (!mainWindow) createMainWindow()
    else { mainWindow.show(); mainWindow.focus() }
  })
}

// ── IPC Handlers ────────────────────────────────────────────────────────────

function broadcastTasksUpdated() {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('tasks:updated')
  if (widgetWindow && !widgetWindow.isDestroyed()) widgetWindow.webContents.send('tasks:updated')
}

function registerIPC() {
  ipcMain.handle('db:getLists', () => db.getLists())
  ipcMain.handle('db:createList', (_, name, color) => db.createList(name, color))
  ipcMain.handle('db:deleteList', (_, id) => { db.deleteList(id); broadcastTasksUpdated() })
  ipcMain.handle('db:updateList', (_, id, name, color) => db.updateList(id, name, color))

  ipcMain.handle('db:getTasks', (_, listId) => db.getTasks(listId))
  ipcMain.handle('db:getAllTasks', () => db.getAllTasks())
  ipcMain.handle('db:createTask', (_, task) => { const t = db.createTask(task); broadcastTasksUpdated(); return t })
  ipcMain.handle('db:updateTask', (_, id, updates) => { db.updateTask(id, updates); broadcastTasksUpdated() })
  ipcMain.handle('db:deleteTask', (_, id) => { db.deleteTask(id); broadcastTasksUpdated() })
  ipcMain.handle('db:completeTask', (_, id) => { db.completeTask(id); broadcastTasksUpdated() })

  ipcMain.on('window:minimize', (e) => BrowserWindow.fromWebContents(e.sender)?.minimize())
  ipcMain.on('window:maximize', (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    win?.isMaximized() ? win.unmaximize() : win?.maximize()
  })
  ipcMain.on('window:close', (e) => BrowserWindow.fromWebContents(e.sender)?.close())
  ipcMain.on('window:openMain', () => {
    if (!mainWindow) createMainWindow()
    else { mainWindow.show(); mainWindow.focus() }
  })
}

// ── App Lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  db.initDB()
  registerIPC()
  createMainWindow()
  createWidgetWindow()
  createTray()
  startScheduler(mainWindow, widgetWindow)
})

app.on('window-all-closed', (e) => {
  // Keep running in tray even when all windows are closed
  e.preventDefault()
})

app.on('before-quit', () => {
  stopScheduler()
})

app.on('activate', () => {
  if (!mainWindow) createMainWindow()
})
