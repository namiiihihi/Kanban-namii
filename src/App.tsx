import { useKanbanStore } from './store/kanbanStore'
import AppLayout from './components/layout/AppLayout'
import Board from './components/kanban/Board'
import ListView from './components/kanban/ListView'
import TaskDetailDrawer from './components/tasks/TaskDetailDrawer'

function App() {
  const currentView = useKanbanStore((state) => state.currentView)

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          {currentView === 'board' ? (
            <div className="h-full px-6 py-2 overflow-x-auto">
              <Board />
            </div>
          ) : (
            <ListView />
          )}
        </div>
      </div>

      {/* The detail drawer is always present, controlled by activeTaskId in the store */}
      <TaskDetailDrawer />
    </AppLayout>
  )
}

export default App
