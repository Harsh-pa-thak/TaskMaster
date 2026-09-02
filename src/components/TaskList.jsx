import { useState, useEffect, useCallback } from 'react'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'

const api = window.taskmaster

export default function TaskList({ list }) {
  const [tasks, setTasks] = useState([])
  const [lists, setLists] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [quickTitle, setQuickTitle] = useState('')

  const loadTasks = useCallback(async () => {
    const data = await api.getTasks(list.id)
    setTasks(data)
  }, [list.id])

  useEffect(() => {
    loadTasks()
    api.getLists().then(setLists)
    api.onTasksUpdated(loadTasks)
  }, [loadTasks])

  const handleQuickAdd = async (e) => {
    e.preventDefault()
    if (!quickTitle.trim()) return
    await api.createTask({ list_id: list.id, title: quickTitle.trim() })
    setQuickTitle('')
    loadTasks()
  }

  const handleFormAdd = async (task) => {
    await api.createTask(task)
    setShowForm(false)
    loadTasks()
  }

  const pending = tasks.filter((t) => !t.is_completed)
  const completed = tasks.filter((t) => t.is_completed)

  return (
    <div className="main-content">
      <div className="content-header">
        <div className="content-header-row">
          <div>
            <div className="content-title" style={{ color: list.color }}>
              {list.name}
            </div>
            <div className="content-subtitle">
              {pending.length} task{pending.length !== 1 ? 's' : ''} remaining
            </div>
          </div>
          <button id="btn-add-task" className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Task
          </button>
        </div>
      </div>

      <div className="quick-add" style={{ margin: '16px 28px 0' }}>
        <form className="quick-add-row" onSubmit={handleQuickAdd}>
          <span style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}>+</span>
          <input
            id="quick-add-input"
            className="quick-add-input"
            placeholder="Quick add a task..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
          />
          {quickTitle && <button type="submit" className="btn btn-primary btn-sm">Add</button>}
        </form>
      </div>

      <div className="task-list">
        {pending.length === 0 && completed.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-text">No tasks yet</div>
            <div className="empty-state-sub">Add a task to get started</div>
          </div>
        )}

        {pending.map((t) => (
          <TaskItem key={t.id} task={t} onRefresh={loadTasks} />
        ))}

        {completed.length > 0 && (
          <>
            <div className="task-section-label" style={{ marginTop: 20 }}>Completed · {completed.length}</div>
            {completed.map((t) => <TaskItem key={t.id} task={t} onRefresh={loadTasks} />)}
          </>
        )}
      </div>

      {showForm && (
        <TaskForm
          lists={lists}
          defaultListId={list.id}
          onSubmit={handleFormAdd}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
