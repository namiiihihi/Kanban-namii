import { useKanbanStore } from '@/store/kanbanStore'
import Board from './Board'
import ListView from './ListView'

export default function TasksView() {
  const currentView = useKanbanStore((state) => state.currentView)

  return (
    <div className="h-full flex flex-col pt-0 transition-opacity duration-300">
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
  )
}
