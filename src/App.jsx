import { useState, useEffect, useCallback } from 'react'
import ProjectSidebar from './components/ProjectSidebar'
import TaskList from './components/TaskList'
import TitleBar from './components/TitleBar'

const api = window.taskmaster

export default function App() {
  const [lists, setLists] = useState([])
  const [activeList, setActiveList] = useState(null)

  const loadLists = useCallback(async () => {
    const data = await api.getLists()
    setLists(data)
    if (!activeList && data.length > 0) setActiveLis(data[0])
  }, [activeList])

  useEffect(() => {
    loadLists()
    api.onTasksUpdated(() => loadLists())
  }, [])

  const handleCreateList = async (name, color) => {
    const newList = await api.createList(name, color)
    setLists((prev) => [...prev, newList])
    setActiveList(newList)
  }

  const handleDeleteList = async (id) => {
    await api.deleteList(id)
    setLists((prev) => {
      const updated = prev.filter((l) => l.id !== id)
      if (activeList?.id === id) setActiveList(updated[0] || null)
      return updated
    })
  }

  return (
    <div className="app-layout">
      <TitleBar title={activeList?.name || 'TaskMaster'} />
      <div className="app-body">
        <ProjectSidebar
          lists={lists}
          activeList={activeList}
          onSelectList={setActiveList}
          onCreateList={handleCreateList}
          onDeleteList={handleDeleteList}
        />
        {activeList ? (
          <TaskList key={activeList.id} list={activeList} />
        ) : (
          <div className="main-content flex-center">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">No list selected</div>
              <div className="empty-state-sub">Create a list to get started</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
