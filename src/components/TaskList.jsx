import { useState } from 'react';
import TaskQuickAdd from './TaskQuickAdd';
import TaskSection from './TaskSection';
import TaskForm from './TaskForm';
import { useTasks } from '../hooks/useTasks';

export default function TaskList({ list }) {
  const [showForm, setShowForm] = useState(false);
  const { pending, completed, lists, createTask, refreshTasks } = useTasks(list.id);

  const handleFormAdd = async (task) => {
    await createTask(task);
    setShowForm(false);
  };

  const handleQuickAdd = async (title) => {
    await createTask({ list_id: list.id, title });
  };

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

      <TaskQuickAdd onAdd={handleQuickAdd} />

      <div className="task-list">
        {pending.length === 0 && completed.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-text">No tasks yet</div>
            <div className="empty-state-sub">Add a task to get started</div>
          </div>
        )}

        <TaskSection tasks={pending} onRefresh={refreshTasks} />
        <TaskSection title="Completed" tasks={completed} onRefresh={refreshTasks} />
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
  );
}
