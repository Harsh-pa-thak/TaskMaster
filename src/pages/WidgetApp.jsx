import { useState, useEffect, useCallback } from 'react'

const api = window.taskmaster

function formatDueDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const now = new Date()
  const isOverdue = d < now && d.toDateString() !== now.toDateString()
  const isToday = d.toDateString() === now.toDateString()
  let label = isToday
    ? `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  return { label, isOverdue }
}

export default function WidgetApp() {
  const [tasks, setTasks] = useState([])
  const [quickTitle, setQuickTitle] = useState('')

  const loadTasks = useCallback(async () => {
    const all = await api.getAllTasks()
    const pending = all
      .filter((t) => !t.is_completed)
      .sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date) - new Date(b.due_date)
      })
    setTasks(pending.slice(0, 12))
  }, [])

  useEffect(() => {
    loadTasks()
    api.onTasksUpdated(loadTasks)
  }, [loadTasks])

  const handleComplete = async (id) => {
    await api.completeTask(id)
    loadTasks()
  }

  const handleQuickAdd = async (e) => {
    e.preventDefault()
    if (!quickTitle.trim()) return
    const lists = await api.getLists()
    if (!lists.length) return
    await api.createTask({ list_id: lists[0].id, title: quickTitle.trim() })
    setQuickTitle('')
    loadTasks()
  }

  return (
    <div className="widget-root">
      <div className="widget-header">
        <div className="widget-title">
          <div className="widget-badge">✓</div>
          TaskMaster
        </div>
        <div className="widget-controls">
          <button
            id="widget-open-main"
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 11, padding: '3px 8px' }}
            onClick={() => api.openMain()}
          >Open →</button>
          <button
            id="widget-close"
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 11, padding: '3px 6px' }}
            onClick={() => api.closeWindow()}
          >✕</button>
        </div>
      </div>

      <div className="widget-list">
        {tasks.length === 0 && (
          <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            🎉 All clear for today!
          </div>
        )}
        {tasks.map((task) => {
          const dateInfo = formatDueDate(task.due_date)
          return (
            <div key={task.id} className="widget-task">
              <button
                id={`widget-check-${task.id}`}
                className="widget-task-check"
                onClick={() => handleComplete(task.id)}
              />
              <div className="widget-task-info">
                <div className="widget-task-title">{task.title}</div>
                {dateInfo && (
                  <div className={`widget-task-date ${dateInfo.isOverdue ? 'overdue' : ''}`}>
                    📅 {dateInfo.label}{dateInfo.isOverdue ? ' · Overdue' : ''}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="widget-footer">
        <form className="widget-add-row" onSubmit={handleQuickAdd}>
          <input
            id="widget-quick-add"
            className="widget-add-input"
            placeholder="+ Quick add task..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
          />
          {quickTitle && (
            <button type="submit" className="btn btn-primary btn-sm" style={{ fontSize: 11, padding: '5px 10px' }}>Add</button>
          )}
        </form>
      </div>
    </div>
  )
}
