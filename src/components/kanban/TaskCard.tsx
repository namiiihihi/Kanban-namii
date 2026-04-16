import { Draggable } from '@hello-pangea/dnd'
import { useKanbanStore } from '@/store/kanbanStore'
import type { Task } from '@/store/kanbanStore'
import { Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { format } from 'date-fns'

interface Props {
  task: Task
  index: number
}

export default function TaskCard({ task, index }: Props) {
  const currentUser = useKanbanStore((state) => state.currentUser)
  const members = useKanbanStore((state) => state.members)
  const removeTask = useKanbanStore((state) => state.removeTask)

  const setActiveTask = useKanbanStore((state) => state.setActiveTask)

  const assignee = members.find((m) => m.id === task.assigneeId)
  const canDelete = !!currentUser

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setActiveTask(task.id)}
          className={`bg-white rounded-xl p-4 shadow-sm border border-pink-100 group relative transition-shadow cursor-pointer ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-pink-300 rotate-2' : 'hover:shadow-md hover:border-pink-200'
          }`}
          style={provided.draggableProps.style}
        >
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-pink-300 hover:text-red-500 hover:bg-pink-50"
              onClick={() => removeTask(task.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
          
          <h3 className="font-medium text-pink-900 text-sm mb-1 pr-6">{task.title}</h3>
          
          {task.description && (
            <p className="text-xs text-pink-600/70 line-clamp-2 mb-2">
              {task.description}
            </p>
          )}

          {task.deadline && (
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-pink-500 mb-3 bg-pink-50/50 w-fit px-2 py-0.5 rounded-full border border-pink-100">
              <span>⏰</span>
              {format(new Date(task.deadline), 'dd/MM/yyyy HH:mm')}
            </div>
          )}

          <div className="flex justify-between items-center mt-auto pt-3 border-t border-pink-50">
            <span className="text-[10px] text-pink-400 font-mono">
              {task.id}
            </span>
            {assignee && (
              <Avatar className="h-6 w-6 border border-pink-200">
                <AvatarFallback className="bg-pink-100 text-pink-700 text-[10px]">
                  {assignee.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
