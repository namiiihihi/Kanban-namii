import { useState, useEffect } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns'
import { vi } from 'date-fns/locale' // For Vietnamese real-world feel
import { useKanbanStore } from '@/store/kanbanStore'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [now, setNow] = useState(new Date())
  const { tasks, setActiveTask } = useKanbanStore()

  // Real-time clock update Every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  
  // Start week on Monday (1) for Vietnamese context
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.deadline) return false
      return isSameDay(parseISO(task.deadline), day)
    })
  }

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-md rounded-tl-3xl border-t border-l border-pink-100/50 p-6 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-6">
            <div>
                <h2 className="text-2xl font-bold text-pink-900 flex items-center gap-3 capitalize">
                    {format(currentDate, 'MMMM yyyy')} 🌸
                </h2>
                <p className="text-sm text-pink-400">Đồng bộ với lịch thực tế 🎀</p>
            </div>
            
            {/* Real-time Digital Clock */}
            <div className="hidden md:flex items-center gap-3 bg-white/60 px-4 py-2 rounded-2xl shadow-sm border border-pink-100 border-dashed animate-pulse">
                <Clock className="h-4 w-4 text-pink-500" />
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-pink-600 leading-none">
                        {format(now, 'HH:mm:ss')}
                    </span>
                    <span className="text-[10px] text-pink-400 font-medium">
                        {format(now, 'EEEE, dd/MM', { locale: vi })}
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-white/60 p-1.5 rounded-2xl shadow-sm border border-pink-50">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevMonth}
            className="h-9 w-9 text-pink-500 hover:bg-pink-100 hover:text-pink-600 rounded-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setCurrentDate(new Date())}
            className="px-4 h-9 text-sm font-medium text-pink-600 hover:bg-pink-100 rounded-xl"
          >
            Hôm nay
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextMonth}
            className="h-9 w-9 text-pink-500 hover:bg-pink-100 hover:text-pink-600 rounded-xl"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Days of Week (Monday Start) */}
      <div className="grid grid-cols-7 mb-2">
        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-pink-300 uppercase tracking-tighter py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-pink-100 border border-pink-100 rounded-2xl overflow-hidden shadow-sm">
        {calendarDays.map((day, idx) => {
          const dayTasks = getTasksForDay(day)
          const isCurrentMonth = isSameMonth(day, monthStart)
          const isToday = isSameDay(day, new Date())

          return (
            <div 
              key={idx}
              className={cn(
                "min-h-0 bg-white p-2 transition-colors flex flex-col gap-1 overflow-hidden group",
                !isCurrentMonth && "bg-pink-50/30 text-pink-200",
                isToday && "bg-pink-50/50"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={cn(
                  "text-sm font-semibold flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-300",
                  isToday 
                    ? "bg-pink-500 text-white shadow-lg ring-4 ring-pink-100 scale-110" 
                    : "text-pink-900 group-hover:bg-pink-50",
                  !isCurrentMonth && "text-pink-200"
                )}>
                  {format(day, 'd')}
                </span>
                {dayTasks.length > 0 && (
                   <span className="text-[10px] font-bold text-pink-400 px-1.5 py-0.5 bg-pink-50 rounded-md border border-pink-100">
                     {dayTasks.length} task
                   </span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide py-1">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setActiveTask(task.id)}
                    className={cn(
                      "text-[10px] p-2 rounded-xl border border-pink-50 cursor-pointer shadow-sm transition-all hover:translate-x-1 active:scale-[0.98] truncate font-semibold",
                      task.status === 'Done' 
                        ? "bg-pink-50/50 text-pink-300 border-none italic line-through" 
                        : "bg-white text-pink-700 hover:border-pink-300 hover:shadow-md hover:bg-pink-50/20"
                    )}
                  >
                    {task.status === 'Done' ? '✨ ' : '📌 '}{task.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
