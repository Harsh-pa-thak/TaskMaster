import ProjectSidebar from './components/ProjectSidebar'
import TaskList from './components/TaskList'
import TitleBar from './components/TitleBar'
import { useLists } from './hooks/useLists'

export default function App() {
  const { lists, activeList, setActiveList, createList, deleteList } = useLists();

  return (
    <div className="app-layout">
      <TitleBar title={activeList?.name || 'TaskMaster'} />
      <div className="app-body">
        <ProjectSidebar
          lists={lists}
          activeList={activeList}
          onSelectList={setActiveList}
          onCreateList={createList}
          onDeleteList={deleteList}
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
