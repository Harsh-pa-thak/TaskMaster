import { useState } from 'react';

export default function TaskQuickAdd({ onAdd }) {
  const [quickTitle, setQuickTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    await onAdd(quickTitle.trim());
    setQuickTitle('');
  };

  return (
    <div className="quick-add" style={{ margin: '16px 28px 0' }}>
      <form className="quick-add-row" onSubmit={handleSubmit}>
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
  );
}
