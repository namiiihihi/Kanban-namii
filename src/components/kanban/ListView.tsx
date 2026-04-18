import { useKanbanStore } from '@/store/kanbanStore'
import type { Task } from '@/store/kanbanStore'
import { format } from 'date-fns'
import { CheckCircle2, Circle, User as UserIcon, Calendar as CalendarIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function ListView() {
  const tasks = useKanbanStore((state) => state.tasks)
  const searchQuery = useKanbanStore((state) => state.searchQuery)
  const setActiveTask = useKanbanStore((state) => state.setActiveTask)
  const members = useKanbanStore((state) => state.members)

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr,120px,180px,100px] gap-4 px-4 py-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
          <div>Task Name</div>
          <div>Assignee</div>
          <div>Deadline</div>
          <div>Status</div>
        </div>

        {/* Task Rows */}
        <div className="space-y-2">
          {filteredTasks.length > 0 ? filteredTasks.map((task) => {
            const assignee = members.find(m => m.id === task.assigneeId)
            
            return (
              <div 
                key={task.id}
                onClick={() => setActiveTask(task.id)}
                className="grid grid-cols-[1fr,120px,180px,100px] gap-4 items-center bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-pink-50 hover:border-pink-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {task.status === 'Done' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-pink-200 group-hover:text-pink-400 transition-colors" />
                  )}
                  <span className="font-medium text-pink-900 truncate">
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 border border-pink-100">
                    <AvatarFallback className="bg-pink-50 text-pink-600 text-[10px]">
                      {assignee?.name.charAt(0) || <UserIcon className="h-3 w-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-pink-700 truncate">{assignee?.name || 'Unassigned'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-pink-600">
                  <CalendarIcon className="h-4 w-4 opacity-40" />
                  <span>{task.deadline ? format(new Date(task.deadline), 'dd/MM/yyyy HH:mm') : '-'}</span>
                </div>

                <div>
                  <Badge variant="outline" className={
                    task.status === 'Done' ? "bg-green-50 text-green-600 border-green-100" :
                    task.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100" :
                    task.status === 'Overdue' ? "bg-red-50 text-red-600 border-red-200" :
                    "bg-pink-50 text-pink-600 border-pink-100"
                  }>
                    {task.status === 'Overdue' ? '🔔 ' : ''}{task.status}
                  </Badge>
                </div>
              </div>
            )
          }) : (
            <div className="text-center py-20 text-pink-300">
              No tasks found 🌸
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
