import { Droppable } from '@hello-pangea/dnd'
import { useKanbanStore } from '@/store/kanbanStore'
import type { Task, TaskStatus } from '@/store/kanbanStore'
import TaskCard from './TaskCard'

interface Props {
  title: TaskStatus
  tasks: Task[]
}

const columnIcons: Record<TaskStatus, string> = {
  'Todo': '📝',
  'In Progress': '⏳',
  'Done': '✅'
}

export default function Column({ title, tasks }: Props) {
  return (
    <div className="flex flex-col w-[350px] shrink-0 bg-white/40 backdrop-blur-md rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-pink-100 bg-white/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <h2 className="font-semibold text-pink-800 flex items-center gap-2">
          <span>{columnIcons[title]}</span>
          {title}
        </h2>
        <span className="text-xs font-semibold text-pink-500 bg-pink-100 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={title}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 p-3 flex flex-col gap-3 min-h-[150px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-pink-50/50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
