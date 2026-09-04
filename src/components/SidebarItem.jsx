export default function SidebarItem({ list, isActive, onSelect, onDelete, showDelete }) {
  return (
    <div
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(list)}
    >
      <span className="sidebar-item-dot" style={{ background: list.color }} />
      <span className="sidebar-item-name">{list.name}</span>
      {isActive && showDelete && (
        <button
          className="btn btn-ghost btn-icon"
          style={{ width: 22, height: 22, fontSize: 11, color: 'var(--text-muted)' }}
          onClick={(e) => { e.stopPropagation(); onDelete(list.id); }}
          title="Delete list"
        >✕</button>
      )}
    </div>
  );
}
