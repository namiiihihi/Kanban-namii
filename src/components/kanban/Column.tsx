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
  'Done': '✅',
  'Overdue': '🔔'
}

const columnStyles: Record<TaskStatus, string> = {
  'Todo': 'text-pink-800 border-pink-100',
  'In Progress': 'text-purple-800 border-purple-100',
  'Done': 'text-green-800 border-green-100',
  'Overdue': 'text-red-800 border-red-200 bg-red-50/20'
}

export default function Column({ title, tasks }: Props) {
  return (
    <div className={`flex flex-col w-[350px] h-full shrink-0 bg-white/40 backdrop-blur-md rounded-2xl border shadow-sm overflow-hidden transition-all ${columnStyles[title]}`}>
      <div className={`p-4 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between ${title === 'Overdue' ? 'border-red-100' : 'border-pink-100'}`}>
        <h2 className={`font-bold flex items-center gap-2 ${title === 'Overdue' ? 'text-red-700 animate-pulse' : ''}`}>
          <span>{columnIcons[title]}</span>
          {title}
        </h2>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          title === 'Overdue' ? 'bg-red-500 text-white' : 'bg-pink-100 text-pink-500'
        }`}>
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={title}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 p-3 flex flex-col gap-3 min-h-[150px] overflow-y-auto custom-scrollbar transition-colors ${
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
