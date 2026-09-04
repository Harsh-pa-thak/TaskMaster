import { useState } from 'react';

const COLORS = ['#6366f1','#ec4899','#f59e0b','#22c55e','#06b6d4','#a855f7','#ef4444','#f97316'];

export default function SidebarForm({ onCreate, onCancel }) {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreate(newName.trim(), newColor);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
