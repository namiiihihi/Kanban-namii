import { useKanbanStore } from './store/kanbanStore'
import AppLayout from './components/layout/AppLayout'
import Board from './components/kanban/Board'
import ListView from './components/kanban/ListView'
import TaskDetailDrawer from './components/tasks/TaskDetailDrawer'
import { useSupabaseSync } from './hooks/useSupabaseSync'
import TasksView from './components/kanban/TasksView'
import MessengerView from './components/messenger/MessengerView'
import CalendarView from './components/calendar/CalendarView'
import ProgressView from './components/analytics/ProgressView'

function App() {
  const activeModule = useKanbanStore((state) => state.activeModule)
  useSupabaseSync() // Background sync

  const renderModule = () => {
    switch (activeModule) {
      case 'tasks':
        return <TasksView />
      case 'messenger':
        return <MessengerView />
      case 'calendar':
        return <CalendarView />
      case 'analytics':
        return <ProgressView />
      default:
        return <TasksView />
    }
  }

  return (
    <AppLayout>
      <div className="flex-1 overflow-hidden relative">
        {renderModule()}
      </div>

      {/* The detail drawer is always present, controlled by activeTaskId in the store */}
      <TaskDetailDrawer />
    </AppLayout>
  )
}

export default App
