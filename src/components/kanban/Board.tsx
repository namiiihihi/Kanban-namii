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
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full overflow-x-auto pb-4 pt-8 shrink-0">
        {COLUMNS.map((col) => {
          const columnTasks = filteredTasks
            .filter((t) => t.status === col)
            .sort((a, b) => {
              // Tasks without deadline go to the bottom
              if (!a.deadline && !b.deadline) return 0
              if (!a.deadline) return 1
              if (!b.deadline) return -1
              // Sort by deadline: nearest first
              return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            })
          return <Column key={col} title={col} tasks={columnTasks} />
        })}
      </div>
    </DragDropContext>
  )
}
