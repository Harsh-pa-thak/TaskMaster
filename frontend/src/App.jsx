import { useState } from 'react'
import Widget from './Widget'
import TaskForm from './TaskForm'

export default function App() {
  const [showForm, setShowForm] = useState(false)

  const handleSave = (task) => {
    console.log('new task:', task)
    setShowForm(false)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Widget onAddTask={() => setShowForm(true)} />
      {showForm && (
        <TaskForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}
    </div>
  )
}
