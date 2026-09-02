import { useState } from 'react'

const api = window.taskmaster

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const isTomorrow = d.toDateString() === new Date(now.getTime() + 86400000).toDateString()
  if (isToday) return { label: `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, isOverdue: d < now }
  if (isTomorrow) return { label: 'Tomorrow', isOverdue: false }
  return { label: d.toLocaleDateString([], { month: 'short', day: 'numeric' }), isOverdue: d < now }
}

export default function TaskItem({ task, onRefresh }) {
  const [checking, setChecking] = useState(false)
  const dateInfo = formatDate(task.due_date)

  const handleComplete = async (e) => {
    e.stopPropagation()
    if (checking) return
    setChecking(true)
    await api.completeTask(task.id)
    onRefresh()
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    await api.deleteTask(task.id)
    onRefresh()
  }

  return (
    <div className={`task-item animate-fadein ${task.is_completed ? 'completed' : ''} ${dateInfo?.isOverdue && !task.is_completed ? 'overdue' : ''}`}>
      <button
        className={`task-checkbox ${task.is_completed ? 'checked' : ''} ${checking ? 'animate-check' : ''}`}
        onClick={handleComplete}
        id={`check-task-${task.id}`}
      >
        <span className="check-icon">✓</span>
      </button>

      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.notes && <div className="task-notes">{task.notes}</div>}
        <div className="task-meta">
          {dateInfo && (
            <span className={`task-meta-date ${dateInfo.isOverdue ? 'badge-overdue' : ''}`}>
              📅 {dateInfo.label}
              {dateInfo.isOverdue && !task.is_completed && <span className="badge badge-overdue" style={{ marginLeft: 4, padding: '0 4px' }}>Overdue</span>}
            </span>
          )}
          {task.recurrence && (
            <span className="task-meta-recur">🔁 {task.recurrence}</span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          id={`delete-task-${task.id}`}
          className="btn btn-ghost btn-icon"
          style={{ color: 'var(--danger)', fontSize: 13 }}
          onClick={handleDelete}
          title="Delete"
        >✕</button>
      </div>
    </div>
  )
}
