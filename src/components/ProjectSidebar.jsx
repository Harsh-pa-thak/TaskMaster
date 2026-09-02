import { useState } from 'react'
import TaskForm from './TaskForm'

const COLORS = ['#6366f1','#ec4899','#f59e0b','#22c55e','#06b6d4','#a855f7','#ef4444','#f97316']

export default function ProjectSidebar({ lists, activeList, onSelectList, onCreateList, onDeleteList }) {
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#6366f1')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    onCreateList(newName.trim(), newColor)
    setNewName('')
    setNewColor('#6366f1')
    setShowForm(false)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Lists</div>
      <div className="sidebar-list">
        {lists.map((list) => (
          <div
            key={list.id}
            className={`sidebar-item ${activeList?.id === list.id ? 'active' : ''}`}
            onClick={() => onSelectList(list)}
          >
            <span className="sidebar-item-dot" style={{ background: list.color }} />
            <span className="sidebar-item-name">{list.name}</span>
            {activeList?.id === list.id && lists.length > 1 && (
              <button
                className="btn btn-ghost btn-icon"
                style={{ width: 22, height: 22, fontSize: 11, color: 'var(--text-muted)' }}
                onClick={(e) => { e.stopPropagation(); onDeleteList(list.id) }}
                title="Delete list"
              >✕</button>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        {showForm ? (
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              className="field-input"
              placeholder="List name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              style={{ fontSize: 13 }}
            />
            <div className="color-swatches">
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`color-swatch ${newColor === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setNewColor(c)}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Create</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 8 }} onClick={() => setShowForm(true)}>
            <span style={{ fontSize: 16 }}>+</span> New List
          </button>
        )}
      </div>
    </aside>
  )
}
