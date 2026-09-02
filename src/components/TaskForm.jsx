export default function TaskForm({ onSubmit, onCancel, lists, defaultListId }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const task = {
      list_id: parseInt(fd.get('list_id')),
      title: fd.get('title').trim(),
      notes: fd.get('notes').trim() || null,
      due_date: fd.get('due_date') ? new Date(fd.get('due_date')).toISOString() : null,
      recurrence: fd.get('recurrence') || null,
    }
    if (!task.title) return
    onSubmit(task)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal animate-fadein" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">New Task</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">Title *</label>
            <input name="title" className="field-input" placeholder="What needs to be done?" autoFocus required />
          </div>
          <div className="field">
            <label className="field-label">Notes</label>
            <textarea name="notes" className="field-textarea" placeholder="Add notes..." />
          </div>
          <div className="field-row">
            <div className="field">
              <label className="field-label">Due Date</label>
              <input name="due_date" type="datetime-local" className="field-input" />
            </div>
            <div className="field">
              <label className="field-label">Repeat</label>
              <select name="recurrence" className="field-select">
                <option value="">No repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label className="field-label">List</label>
            <select name="list_id" className="field-select" defaultValue={defaultListId}>
              {lists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Task</button>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
