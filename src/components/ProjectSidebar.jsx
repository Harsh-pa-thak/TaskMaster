import { useState } from 'react';
import SidebarItem from './SidebarItem';
import SidebarForm from './SidebarForm';

export default function ProjectSidebar({ lists, activeList, onSelectList, onCreateList, onDeleteList }) {
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (name, color) => {
    onCreateList(name, color);
    setShowForm(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Lists</div>
      <div className="sidebar-list">
        {lists.map((list) => (
          <SidebarItem
            key={list.id}
            list={list}
            isActive={activeList?.id === list.id}
            onSelect={onSelectList}
            onDelete={onDeleteList}
            showDelete={lists.length > 1}
          />
        ))}
      </div>

      <div className="sidebar-footer">
        {showForm ? (
          <SidebarForm onCreate={handleCreate} onCancel={() => setShowForm(false)} />
        ) : (
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', gap: 8 }} onClick={() => setShowForm(true)}>
            <span style={{ fontSize: 16 }}>+</span> New List
          </button>
        )}
      </div>
    </aside>
  );
}
