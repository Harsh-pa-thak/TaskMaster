const notifier = require('node-notifier')
const path = require('path')
const { getUpcomingTasks } = require('./db')

let schedulerInterval = null
const notifiedTasks = new Set()

function startScheduler(mainWindow, widgetWindow) {
  // Check every minute
  schedulerInterval = setInterval(() => {
    checkDueTasks(mainWindow, widgetWindow)
  }, 60 * 1000)

  // Also check immediately on start
  checkDueTasks(mainWindow, widgetWindow)
}

function checkDueTasks(mainWindow, widgetWindow) {
  try {
    const tasks = getUpcomingTasks()

    tasks.forEach((task) => {
      if (notifiedTasks.has(task.id)) return
      notifiedTasks.add(task.id)

      const dueDate = new Date(task.due_date)
      const now = new Date()
      const diffMin = Math.round((dueDate - now) / 60000)
      const timeLabel = diffMin <= 0 ? 'now' : `in ${diffMin} min`

      notifier.notify(
        {
          title: '⏰ TaskMaster',
          message: `${task.title} — due ${timeLabel}`,
          icon: path.join(__dirname, '../assets/icon.png'),
          sound: true,
          wait: false,
          appID: 'TaskMaster',
        },
        (err) => {
          if (err) console.error('Notification error:', err)
        }
      )

      // Push to renderer too
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('notification', { task, timeLabel })
      }
      if (widgetWindow && !widgetWindow.isDestroyed()) {
        widgetWindow.webContents.send('notification', { task, timeLabel })
      }
    })
  } catch (e) {
    console.error('Scheduler error:', e)
  }
}

function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval)
    schedulerInterval = null
  }
}

// Clear notified set daily so reminders can fire again next day
setInterval(() => {
  notifiedTasks.clear()
}, 24 * 60 * 60 * 1000)

module.exports = { startScheduler, stopScheduler }
