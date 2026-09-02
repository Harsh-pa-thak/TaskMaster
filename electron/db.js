const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')

const DB_PATH = path.join(app.getPath('userData'), 'taskmaster.db')

let db

function initDB() {
  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#6366f1',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      notes TEXT,
      due_date DATETIME,
      is_completed BOOLEAN DEFAULT 0,
      recurrence TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    );
  `)

  // Seed default list if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM lists').get()
  if (count.c === 0) {
    db.prepare("INSERT INTO lists (name, color) VALUES ('My Tasks', '#6366f1')").run()
  }

  return db
}

// ── Lists ──────────────────────────────────────────────────────────────────

function getLists() {
  return db.prepare('SELECT * FROM lists ORDER BY created_at ASC').all()
}

function createList(name, color = '#6366f1') {
  const stmt = db.prepare('INSERT INTO lists (name, color) VALUES (?, ?)')
  const info = stmt.run(name, color)
  return db.prepare('SELECT * FROM lists WHERE id = ?').get(info.lastInsertRowid)
}

function deleteList(id) {
  return db.prepare('DELETE FROM lists WHERE id = ?').run(id)
}

function updateList(id, name, color) {
  return db.prepare('UPDATE lists SET name = ?, color = ? WHERE id = ?').run(name, color, id)
}

// ── Tasks ──────────────────────────────────────────────────────────────────

function getTasks(listId) {
  return db
    .prepare(
      `SELECT * FROM tasks WHERE list_id = ? ORDER BY
        CASE WHEN due_date IS NULL THEN 1 ELSE 0 END,
        due_date ASC,
        created_at ASC`
    )
    .all(listId)
}

function getAllTasks() {
  return db
    .prepare(
      `SELECT t.*, l.name as list_name, l.color as list_color FROM tasks t
       LEFT JOIN lists l ON t.list_id = l.id
       ORDER BY
         CASE WHEN t.due_date IS NULL THEN 1 ELSE 0 END,
         t.due_date ASC,
         t.created_at ASC`
    )
    .all()
}

function createTask({ list_id, title, notes, due_date, recurrence }) {
  const stmt = db.prepare(
    'INSERT INTO tasks (list_id, title, notes, due_date, recurrence) VALUES (?, ?, ?, ?, ?)'
  )
  const info = stmt.run(list_id, title, notes || null, due_date || null, recurrence || null)
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid)
}

function updateTask(id, { title, notes, due_date, recurrence, list_id }) {
  return db
    .prepare(
      `UPDATE tasks SET
        title = COALESCE(?, title),
        notes = COALESCE(?, notes),
        due_date = COALESCE(?, due_date),
        recurrence = COALESCE(?, recurrence),
        list_id = COALESCE(?, list_id)
       WHERE id = ?`
    )
    .run(title, notes, due_date, recurrence, list_id, id)
}

function deleteTask(id) {
  return db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
}

function completeTask(id) {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
  if (!task) return

  const now = new Date().toISOString()
  db.prepare('UPDATE tasks SET is_completed = 1, completed_at = ? WHERE id = ?').run(now, id)

  // Handle recurrence: create next occurrence
  if (task.recurrence && task.due_date) {
    const nextDate = getNextRecurrence(new Date(task.due_date), task.recurrence)
    createTask({
      list_id: task.list_id,
      title: task.title,
      notes: task.notes,
      due_date: nextDate.toISOString(),
      recurrence: task.recurrence,
    })
  }
}

function getUpcomingTasks() {
  const now = new Date()
  const soon = new Date(now.getTime() + 10 * 60 * 1000) // next 10 minutes
  return db
    .prepare(
      `SELECT * FROM tasks WHERE is_completed = 0 AND due_date IS NOT NULL
       AND due_date <= ? AND due_date >= ?`
    )
    .all(soon.toISOString(), now.toISOString())
}

function getNextRecurrence(date, recurrence) {
  const next = new Date(date)
  if (recurrence === 'daily') next.setDate(next.getDate() + 1)
  else if (recurrence === 'weekly') next.setDate(next.getDate() + 7)
  else if (recurrence === 'monthly') next.setMonth(next.getMonth() + 1)
  return next
}

module.exports = {
  initDB,
  getLists,
  createList,
  deleteList,
  updateList,
  getTasks,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getUpcomingTasks,
}
