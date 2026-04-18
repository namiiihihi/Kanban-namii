import { DragDropContext } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { useKanbanStore } from '@/store/kanbanStore'
import type { TaskStatus } from '@/store/kanbanStore'
import Column from './Column'

const COLUMNS: TaskStatus[] = ['Todo', 'In Progress', 'Done', 'Overdue']

export default function Board() {
  const tasks = useKanbanStore((state) => state.tasks)
  const searchQuery = useKanbanStore((state) => state.searchQuery)
  const updateTaskStatus = useKanbanStore((state) => state.updateTaskStatus)

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const newStatus = destination.droppableId as TaskStatus
    updateTaskStatus(draggableId, newStatus)

    // Play alarm sound if moved to Overdue
    if (newStatus === 'Overdue') {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3')
      audio.volume = 0.5
      audio.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full overflow-x-auto pb-4 pt-8 shrink-0">
        {COLUMNS.map((col) => {
          const columnTasks = filteredTasks.filter((t) => t.status === col)
          return <Column key={col} title={col} tasks={columnTasks} />
        })}
      </div>
    </DragDropContext>
  )
}
