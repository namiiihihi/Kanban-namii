import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export type Role = 'admin' | 'member'

export interface User {
  id: string
  name: string
  role: Role
  avatarUrl?: string
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Done' | 'Overdue'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  assigneeId?: string
  deadline?: string // ISO string
}

export interface Message {
  id: string
  content: string
  userId: string
  createdAt: string
}

export interface KanbanState {
  members: User[]
  tasks: Task[]
  messages: Message[]
  currentUser: User | null
  activeTaskId: string | null
  activeModule: 'tasks' | 'messenger' | 'calendar' | 'analytics'
  currentView: 'board' | 'list'
  searchQuery: string
  
  // Actions
  setInitialData: () => Promise<void>
  setTasks: (tasks: Task[]) => void
  setMembers: (members: User[]) => void
  setMessages: (messages: Message[]) => void
  
  addTask: (task: Omit<Task, 'id'>) => Promise<void>
  removeTask: (taskId: string) => Promise<void>
  updateTask: (task: Partial<Task> & { id: string }) => Promise<void>
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>
  setActiveTask: (taskId: string | null) => void
  setActiveModule: (module: 'tasks' | 'messenger' | 'calendar' | 'analytics') => void
  setCurrentView: (view: 'board' | 'list') => void
  setSearchQuery: (query: string) => void
  
  sendMessage: (content: string) => Promise<void>
  
  addMember: (member: Omit<User, 'id'>) => Promise<void>
  removeMember: (memberId: string) => Promise<void>
  updateMemberRole: (memberId: string, role: Role) => Promise<void>
}

const getSavedUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem('kanban_user')
  return saved ? JSON.parse(saved) : null
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  members: [],
  tasks: [],
  messages: [],
  currentUser: getSavedUser(),
  activeTaskId: null,
  activeModule: 'tasks',
  currentView: 'board',
  searchQuery: '',

  setTasks: (tasks: Task[]) => set({ tasks }),
  setMembers: (members: User[]) => set({ members }),
  setMessages: (messages: Message[]) => set({ messages }),

  setInitialData: async () => {
    const [{ data: tasks }, { data: members }, { data: messages }] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: true }),
      supabase.from('members').select('*'),
      supabase.from('messages').select('*').order('created_at', { ascending: true })
    ])
    
    if (tasks) {
      set({ 
        tasks: (tasks as any[]).map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          assigneeId: t.assignee_id,
          deadline: t.deadline
        })) as Task[] 
      })
    }
    if (members) {
      set({ members: members as User[] })
    }
    if (messages) {
      set({ 
        messages: messages.map(m => ({
          id: m.id,
          content: m.content,
          userId: m.user_id,
          createdAt: m.created_at
        }))
      })
    }
  },

  addTask: async (taskData) => {
    const id = `t-${Math.random().toString(36).substr(2, 9)}`
    const newTask = { ...taskData, id }
    set((state) => ({ tasks: [...state.tasks, newTask] }))
    
    const { error } = await supabase.from('tasks').insert([{
      id,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      assignee_id: newTask.assigneeId,
      deadline: newTask.deadline
    }])
    if (error) console.error('Error adding task:', error)
  },

  removeTask: async (taskId) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }))
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) console.error('Error removing task:', error)
  },

  updateTask: async (taskUpdate) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskUpdate.id ? { ...t, ...taskUpdate } : t
      ),
    }))

    const { error } = await supabase.from('tasks').update({
      title: taskUpdate.title,
      description: taskUpdate.description,
      status: taskUpdate.status,
      assignee_id: taskUpdate.assigneeId,
      deadline: taskUpdate.deadline
    }).eq('id', taskUpdate.id)
    if (error) console.error('Error updating task:', error)
  },

  updateTaskStatus: async (taskId, newStatus) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }))
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId)
    if (error) console.error('Error updating status:', error)
  },

  setActiveTask: (taskId) => set({ activeTaskId: taskId }),
  
  setActiveModule: (module) => set({ activeModule: module }),

  setCurrentView: (view) => set({ currentView: view }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),

  login: async (name, role = 'member') => {
    // Check if user already exists
    const { data: existing } = await supabase
      .from('members')
      .select('*')
      .eq('name', name)
      .single()

    let user: User
    if (existing) {
      user = existing as User
      // Force admin for owner if not already set
      if (name === 'Bùi Xuân Nhi' && user.role !== 'admin') {
        user.role = 'admin'
        await supabase.from('members').update({ role: 'admin' }).eq('name', name)
      }
    } else {
      const id = `u-${Math.random().toString(36).substr(2, 9)}`
      // Hardcode admin for the owner
      const assignedRole = name === 'Bùi Xuân Nhi' ? 'admin' : role
      user = { id, name, role: assignedRole, avatarUrl: '' }
      await supabase.from('members').insert([{
        id,
        name,
        role: assignedRole,
        avatar_url: ''
      }])
    }

    set((state) => ({ 
      currentUser: user,
      members: state.members.some(m => m.id === user.id) 
        ? state.members 
        : [...state.members, user]
    }))
    localStorage.setItem('kanban_user', JSON.stringify(user))
  },

  logout: () => {
    set({ currentUser: null })
    localStorage.removeItem('kanban_user')
  },

  sendMessage: async (content) => {
    const { currentUser } = get()
    if (!currentUser) return

    // Optimistic Update
    const tempId = `m-temp-${Date.now()}`
    const newMessage = {
      id: tempId,
      content,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    }
    
    set((state) => ({ 
      messages: [...state.messages, newMessage] 
    }))

    const { error } = await supabase.from('messages').insert([{
      content,
      user_id: currentUser.id
    }])
    
    if (error) {
      console.error('Error sending message:', error)
      alert(`Messenger Error: ${error.message || 'Unknown error'}`)
      // Rollback optimistic update
      set((state) => ({ 
        messages: state.messages.filter(m => m.id !== tempId) 
      }))
    }
  },

  addMember: async (memberData) => {
    const id = `u-${Math.random().toString(36).substr(2, 9)}`
    const newMember = { ...memberData, id }
    set((state) => ({ members: [...state.members, newMember] }))
    const { error } = await supabase.from('members').insert([{
      id,
      name: newMember.name,
      role: newMember.role,
      avatar_url: newMember.avatarUrl
    }])
    if (error) console.error('Error adding member:', error)
  },

  removeMember: async (memberId) => {
    set((state) => ({ members: state.members.filter((m) => m.id !== memberId) }))
    const { error } = await supabase.from('members').delete().eq('id', memberId)
    if (error) console.error('Error removing member:', error)
  },

  updateMemberRole: async (memberId, role) => {
    set((state) => ({
      members: state.members.map((m) =>
        m.id === memberId ? { ...m, role } : m
      ),
    }))
    const { error } = await supabase.from('members').update({ role }).eq('id', memberId)
    if (error) console.error('Error updating member role:', error)
  },
}))


