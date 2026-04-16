import { useKanbanStore } from '@/store/kanbanStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Target, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Users
} from 'lucide-react'

export default function ProgressView() {
  const { tasks, members } = useKanbanStore()

  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'Done').length
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const getMemberStats = (memberId: string) => {
    const assignedTasks = tasks.filter(t => t.assigneeId === memberId)
    const completedTasks = assignedTasks.filter(t => t.status === 'Done').length
    const total = assignedTasks.length
    const progress = total > 0 ? Math.round((completedTasks / total) * 100) : 0
    
    return { total, completedTasks, progress }
  }

  // Sort members by performance
  const sortedMembers = [...members].sort((a, b) => {
    const statsA = getMemberStats(a.id)
    const statsB = getMemberStats(b.id)
    return statsB.progress - statsA.progress
  })

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-md rounded-tl-3xl border-t border-l border-pink-100/50 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl font-bold text-pink-900 flex items-center gap-3">
            Team Performance 🎵
          </h2>
          <p className="text-sm text-pink-400">Track task completion and productivity stats</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white/60 p-4 rounded-2xl shadow-sm border border-pink-50 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs text-pink-400">Completion</p>
                    <p className="text-xl font-bold text-pink-900">{completionRate}%</p>
                </div>
            </div>
            <div className="bg-white/60 p-4 rounded-2xl shadow-sm border border-pink-50 flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-xl text-pink-600">
                    <Target className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs text-pink-400">Total Tasks</p>
                    <p className="text-xl font-bold text-pink-900">{totalTasks}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Leaderboard Card */}
        <Card className="lg:col-span-2 bg-white/60 border-pink-50 shadow-sm rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-lg text-pink-900">Member Progress</CardTitle>
                    <CardDescription className="text-xs">Based on assigned tasks and status</CardDescription>
                </div>
                <Users className="h-5 w-5 text-pink-300" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-6 py-4">
              <div className="space-y-6">
                {sortedMembers.map((member, idx) => {
                  const { total, completedTasks, progress } = getMemberStats(member.id)
                  
                  return (
                    <div key={member.id} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10 border border-pink-100">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="bg-pink-50 text-pink-600 font-bold">
                                {member.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {idx === 0 && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 p-1 rounded-full shadow-sm border-2 border-white">
                                    <Trophy className="h-2 w-2 text-white" />
                                </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-pink-900">{member.name}</p>
                            <p className="text-[10px] text-pink-400">{member.role === 'admin' ? 'Workspace Admin' : 'Member'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-pink-600">{progress}%</p>
                          <p className="text-[10px] text-pink-300">{completedTasks}/{total} Tasks Done</p>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-pink-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Stats Column */}
        <div className="space-y-6 flex flex-col">
            <Card className="bg-gradient-to-br from-pink-500 to-pink-600 border-none text-white shadow-lg rounded-3xl">
                <CardContent className="p-6">
                    <TrendingUp className="h-8 w-8 mb-4 opacity-80" />
                    <h3 className="text-xl font-bold mb-1">Productivity Tips 🎀</h3>
                    <p className="text-xs opacity-90 leading-relaxed">
                        To improve your team's completion rate, break down big tasks into smaller ones and set realistic deadlines!
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-white/60 border-pink-50 shadow-sm rounded-3xl flex-1">
                <CardHeader>
                    <CardTitle className="text-sm">Activity Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                            <Clock className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-pink-900">Task Velocity</p>
                            <p className="text-[10px] text-pink-400">Increasing by 12% this week</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-pink-900">Engagement</p>
                            <p className="text-[10px] text-pink-400">Highly active members: {members.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
