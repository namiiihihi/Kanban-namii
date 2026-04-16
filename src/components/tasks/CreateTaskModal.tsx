import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useKanbanStore } from '@/store/kanbanStore'
import type { TaskStatus } from '@/store/kanbanStore'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateTaskModal({ open, onOpenChange }: Props) {
  const addTask = useKanbanStore((state) => state.addTask)
  const members = useKanbanStore((state) => state.members)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('Todo')
  const [assigneeId, setAssigneeId] = useState<string>('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('00:00')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    let deadline: string | undefined = undefined
    if (deadlineDate) {
      deadline = new Date(`${deadlineDate}T${deadlineTime || '00:00'}`).toISOString()
    }

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      assigneeId: assigneeId || undefined,
      deadline,
    })

    // Reset and close
    setTitle('')
    setDescription('')
    setStatus('Todo')
    setAssigneeId('')
    setDeadlineDate('')
    setDeadlineTime('00:00')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-pink-600 flex items-center gap-2">
            <span>✨</span> Create New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Task Title 🎀</Label>
            <Input
              required
              placeholder="e.g. Design a lovely logo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus-visible:ring-pink-300"
            />
          </div>

          <div className="space-y-2">
            <Label>Description 📝</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status ⏳</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Assignee 🙋‍♀️</Label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Deadline Date 📅</Label>
              <Input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="focus-visible:ring-pink-300"
              />
            </div>
            <div className="space-y-2">
              <Label>Time ⏰</Label>
              <Input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="focus-visible:ring-pink-300"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-medium">
              Create Task ✨
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
