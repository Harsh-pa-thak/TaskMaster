import TaskItem from './TaskItem';

export default function TaskSection({ title, tasks, onRefresh }) {
  if (!tasks || tasks.length === 0) return null;
  
  return (
    <>
      {title && (
        <div className="task-section-label" style={{ marginTop: 20 }}>
          {title} · {tasks.length}
        </div>
      )}
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onRefresh={onRefresh} />
      ))}
    </>
  );
}
