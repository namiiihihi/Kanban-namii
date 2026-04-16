import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useKanbanStore } from '@/store/kanbanStore'
import type { TaskStatus } from '@/store/kanbanStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, User as UserIcon, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'

export default function TaskDetailDrawer() {
  const activeTaskId = useKanbanStore((state) => state.activeTaskId)
  const setActiveTask = useKanbanStore((state) => state.setActiveTask)
  const tasks = useKanbanStore((state) => state.tasks)
  const updateTask = useKanbanStore((state) => state.updateTask)
  const removeTask = useKanbanStore((state) => state.removeTask)
  const members = useKanbanStore((state) => state.members)
  const currentUser = useKanbanStore((state) => state.currentUser)

  const task = tasks.find((t) => t.id === activeTaskId)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('Todo')
  const [assigneeId, setAssigneeId] = useState('')
  const [deadline, setDeadline] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setStatus(task.status)
      setAssigneeId(task.assigneeId || '')
      setDeadline(task.deadline || '')
    }
  }, [task])

  if (!task) return null

  const handleUpdate = (updates: Partial<typeof task>) => {
    updateTask({ ...updates, id: task.id })
  }

  const assignee = members.find((m) => m.id === assigneeId)

  return (
    <Sheet open={!!activeTaskId} onOpenChange={(open) => !open && setActiveTask(null)}>
      <SheetContent className="sm:max-w-xl bg-white border-l border-pink-100 p-0 overflow-y-auto">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b border-pink-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={task.status === 'Done' ? "text-green-500" : "text-pink-300"} />
                <span className="text-xs font-mono text-pink-400">{task.id}</span>
              </div>
              <div className="flex items-center gap-2">
                {!!currentUser && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-pink-300 hover:text-red-500 hover:bg-red-50"
                    onClick={() => {
                        removeTask(task.id)
                        setActiveTask(null)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <SheetTitle className="mt-4">
              <Input 
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value)
                    handleUpdate({ title: e.target.value })
                }}
                className="text-xl font-bold border-none px-0 focus-visible:ring-0 bg-transparent text-pink-900"
              />
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 p-6 space-y-8">
            {/* Status & Assignee Section */}
            <div className="grid grid-cols-2 gap-8 ring-1 ring-pink-50 p-4 rounded-2xl bg-pink-50/20">
              <div className="space-y-3">
                <Label className="text-pink-400 text-xs flex items-center gap-2">
                  <UserIcon className="h-3 w-3" /> Assignee
                </Label>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <Avatar className="h-8 w-8 border border-pink-100">
                    <AvatarFallback className="bg-pink-100 text-pink-600 text-xs font-bold">
                        {assignee?.name.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <select 
                    value={assigneeId}
                    onChange={(e) => {
                        setAssigneeId(e.target.value)
                        handleUpdate({ assigneeId: e.target.value })
                    }}
                    className="bg-transparent text-sm font-medium text-pink-700 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-pink-400 text-xs flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" /> Deadline
                </Label>
                <div className="flex flex-col">
                  <Input 
                    type="datetime-local"
                    value={deadline ? format(new Date(deadline), "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => {
                        const val = e.target.value ? new Date(e.target.value).toISOString() : ''
                        setDeadline(val)
                        handleUpdate({ deadline: val })
                    }}
                    className="border-none p-0 h-auto focus-visible:ring-0 bg-transparent text-sm font-medium text-pink-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label className="text-pink-800 font-semibold">Description 📝</Label>
              <textarea 
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value)
                    handleUpdate({ description: e.target.value })
                }}
                placeholder="Add more details about this task..."
                className="w-full min-h-[150px] p-4 rounded-2xl bg-pink-50/30 border-pink-100 text-pink-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all resize-none"
              />
            </div>

            {/* Lark-style Subtasks (Placeholder) */}
            <div className="space-y-4">
              <Label className="text-pink-800 font-semibold flex items-center justify-between">
                Subtasks 🎀
                <Button variant="ghost" size="sm" className="text-xs text-pink-500 hover:text-pink-600 hover:bg-pink-100/50">+ Add</Button>
              </Label>
              <div className="space-y-2 opacity-50">
                <div className="flex items-center gap-2 text-sm text-pink-600 border border-pink-100 p-2 rounded-lg italic">
                  Features coming soon... 🌸
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-pink-50 bg-pink-50/10 text-center">
            <span className="text-[10px] text-pink-300">Edited with love 💖</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
