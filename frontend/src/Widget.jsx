import { useState } from 'react'
import './Widget.css'

const PRIORITY_DOT = {
  low:    { color: 'var(--p-low)' },
  medium: { color: 'var(--p-medium)' },
  high:   { color: 'var(--p-high)' },
  urgent: { color: 'var(--p-urgent)' },
}

// ── mock data (will be replaced by backend calls) ──────────────────────
const MOCK_TASKS = [
  { id: 1, title: 'Team standup notes',     priority: 'low',    time: '09:00', due: 'today',    done: true  },
  { id: 2, title: 'Review PR #142',         priority: 'medium', time: '12:30', due: 'today',    done: false },
  { id: 3, title: 'Ship v0.2 release notes',priority: 'high',   time: '17:00', due: 'today',    done: false },
  { id: 4, title: 'Renew server certs',     priority: 'urgent', time: null,    due: 'tomorrow', done: false },
]

function TaskRow({ task, onToggle }) {
  const dot = PRIORITY_DOT[task.priority]
  return (
    <div className={`task-row ${task.done ? 'done' : ''}`}>
      <button className={`checkbox ${task.done ? 'checked' : ''}`} onClick={() => onToggle(task.id)}>
        {task.done && <span className="checkmark">✓</span>}
      </button>
      <span className="task-title">{task.title}</span>
      <span className="task-right">
        {task.priority !== 'low' && (
          <span className="priority-dot" style={{ background: dot.color }} />
        )}
        <span className="task-time">{task.time || task.due}</span>
      </span>
    </div>
  )
}

export default function Widget({ onAddTask }) {
  const [tasks, setTasks] = useState(MOCK_TASKS)

  const toggle = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const today    = tasks.filter((t) => t.due === 'today')
  const upcoming = tasks.filter((t) => t.due !== 'today')

  return (
    <div className="widget">
      {/* window chrome */}
      <div className="widget-chrome">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
      </div>

      {/* task sections */}
      <div className="widget-body">
        {today.length > 0 && (
          <section>
            <div className="section-label">today · {today.length}</div>
            {today.map((t) => <TaskRow key={t.id} task={t} onToggle={toggle} />)}
          </section>
        )}

        {upcoming.length > 0 && (
          <section>
            <div className="section-label">upcoming · {upcoming.length}</div>
            {upcoming.map((t) => <TaskRow key={t.id} task={t} onToggle={toggle} />)}
          </section>
        )}
      </div>

      {/* footer */}
      <button className="add-task-btn" onClick={onAddTask}>
        add a task
      </button>
    </div>
  )
}
