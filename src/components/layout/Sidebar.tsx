import { useKanbanStore } from '@/store/kanbanStore'
import { cn } from '@/lib/utils'
import { 
  CheckSquare, 
  MessageSquare, 
  BarChart2, 
  Calendar,
  Settings
} from 'lucide-react'

const navItems = [
  { icon: CheckSquare, label: 'Tasks', id: 'tasks', emoji: '🎀' },
  { icon: MessageSquare, label: 'Messenger', id: 'messenger', emoji: '💖' },
  { icon: BarChart2, label: 'Progress', id: 'analytics', emoji: '🎵' },
  { icon: Calendar, label: 'Calendar', id: 'calendar', emoji: '🌸' },
] as const

export default function Sidebar() {
  const activeModule = useKanbanStore((state) => state.activeModule)
  const setActiveModule = useKanbanStore((state) => state.setActiveModule)

  return (
    <aside className="w-16 lg:w-20 bg-white/40 backdrop-blur-xl border-r border-pink-100 flex flex-col items-center py-6 gap-8 z-20">
      <div 
        className="text-2xl hover:scale-110 transition-transform cursor-pointer"
        onClick={() => setActiveModule('tasks')}
      >
        🎀
      </div>
      
      <nav className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={cn(
              "p-3 rounded-2xl cursor-pointer transition-all group relative flex items-center justify-center",
              item.id === activeModule 
                ? "bg-pink-100/80 text-pink-600 shadow-sm" 
                : "text-pink-400 hover:bg-pink-50 hover:text-pink-500"
            )}
            title={item.label}
          >
            <item.icon className="h-6 w-6" />
            <span className="absolute left-full ml-4 px-2 py-1 bg-pink-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.label} {item.emoji}
            </span>
          </div>
        ))}
      </nav>

      <div className="p-3 text-pink-400 hover:text-pink-500 cursor-pointer transition-colors">
        <Settings className="h-6 w-6" />
      </div>
    </aside>
  )
}
