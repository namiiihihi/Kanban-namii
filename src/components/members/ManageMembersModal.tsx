import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useKanbanStore } from '@/store/kanbanStore'
import type { Role } from '@/store/kanbanStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ManageMembersModal({ open, onOpenChange }: Props) {
  const members = useKanbanStore((state) => state.members)
  const currentUser = useKanbanStore((state) => state.currentUser)
  const addMember = useKanbanStore((state) => state.addMember)
  const removeMember = useKanbanStore((state) => state.removeMember)
  const updateMemberRole = useKanbanStore((state) => state.updateMemberRole)

  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState<Role>('member')

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName.trim()) return
    addMember({ name: newMemberName.trim(), role: newMemberRole })
    setNewMemberName('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-pink-200">
        <DialogHeader>
          <DialogTitle className="text-pink-600 flex items-center gap-2">
            <span>🎵</span> Manage Workspace Members
          </DialogTitle>
          <DialogDescription>
            Add or remove people in your cute kanban workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <form onSubmit={handleAddMember} className="flex flex-col gap-3">
            <Label>Invite new member 🎀</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="focus-visible:ring-pink-300"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value as Role)}
                className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                Add
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            <Label>Current Members</Label>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg border border-pink-100 bg-pink-50/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-pink-200">
                      <AvatarFallback className="bg-pink-200 text-pink-700 text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-pink-900">{member.name}</span>
                      <span className="text-xs text-pink-500">{member.role}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {member.id !== currentUser?.id && currentUser?.role === 'admin' && (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => updateMemberRole(member.id, e.target.value as Role)}
                          className="h-8 text-xs rounded-md border border-input bg-white px-2"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeMember(member.id)}
                          className="h-8 w-8 text-pink-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {member.id === currentUser?.id && (
                      <Badge variant="secondary" className="bg-pink-100 text-pink-600 border-pink-200">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
