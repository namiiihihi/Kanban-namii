import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'admin' | 'member'

export interface User {
  id: string
  name: string
  role: Role
  avatarUrl?: string
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Done'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  assigneeId?: string
  deadline?: string // ISO string
}

export interface KanbanState {
  members: User[]
  tasks: Task[]
  currentUser: User | null
  activeTaskId: string | null
  currentView: 'board' | 'list'
  searchQuery: string
  
  // Actions
  addTask: (task: Omit<Task, 'id'>) => void
  removeTask: (taskId: string) => void
  updateTask: (task: Partial<Task> & { id: string }) => void
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void
  setActiveTask: (taskId: string | null) => void
  setCurrentView: (view: 'board' | 'list') => void
  setSearchQuery: (query: string) => void
  
  addMember: (member: Omit<User, 'id'>) => void
  removeMember: (memberId: string) => void
  updateMemberRole: (memberId: string, role: Role) => void
}

const mockDefaultUser: User = {
  id: 'u-1',
  name: 'Admin Nhi 🎀',
  role: 'admin',
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      members: [mockDefaultUser],
      tasks: [
        {
          id: 't-1',
          title: 'Design UI mockup 💖',
          description: 'Create cute pink layout using Tailwind',
          status: 'Todo',
          assigneeId: 'u-1',
        },
        {
          id: 't-2',
          title: 'Setup Zustand 🎵',
          description: 'Add state management for Kanban',
          status: 'In Progress',
          assigneeId: 'u-1',
        },
      ],
      currentUser: mockDefaultUser, // Mock logged in user
      activeTaskId: null,
      currentView: 'board',
      searchQuery: '',

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, id: `t-${Math.random().toString(36).substr(2, 9)}` },
          ],
        })),

      removeTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        })),

      updateTask: (taskUpdate) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskUpdate.id ? { ...t, ...taskUpdate } : t
          ),
        })),

      updateTaskStatus: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          ),
        })),

      setActiveTask: (taskId) => set({ activeTaskId: taskId }),
      
      setCurrentView: (view) => set({ currentView: view }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),

      addMember: (member) =>
        set((state) => ({
          members: [
            ...state.members,
            { ...member, id: `u-${Math.random().toString(36).substr(2, 9)}` },
          ],
        })),

      removeMember: (memberId) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== memberId),
        })),

      updateMemberRole: (memberId, role) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId ? { ...m, role } : m
          ),
        })),
    }),
    {
      name: 'kanban-storage',
    }
  )
)
