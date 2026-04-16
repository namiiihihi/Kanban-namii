import { useState } from 'react'
import { useKanbanStore } from '@/store/kanbanStore'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ManageMembersModal from '@/components/members/ManageMembersModal'
import { Input } from '@/components/ui/input'
import { Search, LayoutGrid, List, Plus, LogOut, Users } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CreateTaskModal from '@/components/tasks/CreateTaskModal'

export default function Header() {
  const currentUser = useKanbanStore((state) => state.currentUser)
  const searchQuery = useKanbanStore((state) => state.searchQuery)
  const setSearchQuery = useKanbanStore((state) => state.setSearchQuery)
  const currentView = useKanbanStore((state) => state.currentView)
  const setCurrentView = useKanbanStore((state) => state.setCurrentView)
  
  const logout = useKanbanStore((state) => state.logout)
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  return (
    <header className="border-b border-pink-200 bg-white/50 backdrop-blur-md h-16 flex items-center shrink-0 z-10 px-6 gap-6 justify-between">
      <div className="flex items-center gap-4 w-1/4">
        <h1 className="text-xl font-bold text-pink-600 truncate">
          Kanban Workspace 🎀
        </h1>
      </div>

      <div className="flex-1 max-w-xl flex items-center gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400 group-focus-within:text-pink-600 transition-colors" />
          <Input 
            placeholder="Search tasks... 🌸" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-pink-50/50 border-pink-100 focus-visible:ring-pink-300 w-full"
          />
        </div>
        <Button 
          onClick={() => setIsCreateTaskOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white shrink-0 shadow-sm transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Task 🎵
        </Button>
      </div>
      
      <div className="flex items-center gap-4 w-1/4 justify-end">
        <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as 'board' | 'list')}>
          <TabsList className="bg-pink-100/50">
            <TabsTrigger value="board" className="data-[state=active]:bg-white data-[state=active]:text-pink-600">
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:text-pink-600">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {currentUser?.role === 'admin' && (
          <Button 
            variant="outline" 
            size="sm"
            className="border-pink-200 text-pink-700 hover:bg-white/80 hidden lg:flex gap-2"
            onClick={() => setIsManageMembersOpen(true)}
          >
            <Users className="h-4 w-4" />
            Team
          </Button>
        )}

        <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-pink-200 transition-all">
                <AvatarImage src={currentUser?.avatarUrl} />
                <AvatarFallback className="bg-pink-100 text-pink-700">
                    {currentUser?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-pink-50 text-pink-400 hover:text-pink-600"
                onClick={() => logout()}
            >
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </div>

      <ManageMembersModal 
        open={isManageMembersOpen} 
        onOpenChange={setIsManageMembersOpen} 
      />

      <CreateTaskModal 
        open={isCreateTaskOpen} 
        onOpenChange={setIsCreateTaskOpen} 
      />
    </header>
  )
}
