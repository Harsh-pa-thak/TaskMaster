import { useState } from 'react'
import './TaskForm.css'

const PRIORITIES = ['low', 'medium', 'high', 'urgent']

export default function TaskForm({ onSave, onCancel }) {
  const [title, setTitle]         = useState('')
  const [notes, setNotes]         = useState('')
  const [date, setDate]           = useState('')
  const [time, setTime]           = useState('')
  const [repeat, setRepeat]       = useState('does not repeat')
  const [priority, setPriority]   = useState('medium')
  const [notify, setNotify]       = useState('notify at due time')

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title, notes, date, time, repeat, priority, notify })
  }

  return (
    <div className="form-overlay" onClick={onCancel}>
      <div className="form-card" onClick={(e) => e.stopPropagation()}>
        <div className="form-label-top">new task</div>

        <input
          className="form-input"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        <textarea
          className="form-textarea"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="form-row">
          <input
            className="form-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            className="form-input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
        >
          <option>does not repeat</option>
          <option>daily</option>
          <option>weekly</option>
          <option>monthly</option>
        </select>

        <div className="form-section-label">priority</div>
        <div className="priority-row">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              className={`priority-pill priority-${p} ${priority === p ? 'active' : ''}`}
              onClick={() => setPriority(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <select
          className="form-select"
          value={notify}
          onChange={(e) => setNotify(e.target.value)}
        >
          <option>notify at due time</option>
          <option>5 min before</option>
          <option>15 min before</option>
          <option>30 min before</option>
          <option>1 hour before</option>
          <option>no notification</option>
        </select>

        <div className="form-actions">
          <button className="btn-cancel" onClick={onCancel}>cancel</button>
          <button className="btn-save" onClick={handleSave}>save task</button>
        </div>
      </div>
    </div>
  )
}
