import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useKanbanStore } from '@/store/kanbanStore'
import type { Task, User } from '@/store/kanbanStore'

export function useSupabaseSync() {
  const setInitialData = useKanbanStore((state) => state.setInitialData)
  const tasks = useKanbanStore((state) => state.tasks)
  const members = useKanbanStore((state) => state.members)
  const setTasks = useKanbanStore((state) => state.setTasks)
  const setMembers = useKanbanStore((state) => state.setMembers)

  useEffect(() => {
    // 1. Initial Fetch
    setInitialData()

    // 2. Real-time Subscription for Tasks
    const tasksChannel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload

          if (eventType === 'INSERT') {
            const newTask = {
                id: newRecord.id,
                title: newRecord.title,
                description: newRecord.description,
                status: newRecord.status,
                assigneeId: newRecord.assignee_id,
                deadline: newRecord.deadline
            } as Task
            useKanbanStore.setState((state) => ({
                tasks: state.tasks.some(t => t.id === newTask.id) 
                    ? state.tasks 
                    : [...state.tasks, newTask]
            }))
          } else if (eventType === 'UPDATE') {
            const updatedTask = {
                id: newRecord.id,
                title: newRecord.title,
                description: newRecord.description,
                status: newRecord.status,
                assigneeId: newRecord.assignee_id,
                deadline: newRecord.deadline
            } as Task
            useKanbanStore.setState((state) => ({
                tasks: state.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
            }))
          } else if (eventType === 'DELETE') {
            useKanbanStore.setState((state) => ({
                tasks: state.tasks.filter(t => t.id !== oldRecord.id)
            }))
          }
        }
      )
      .subscribe()

    // 3. Real-time Subscription for Members
    const membersChannel = supabase
      .channel('members-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload

          if (eventType === 'INSERT') {
            const newMember = {
                id: newRecord.id,
                name: newRecord.name,
                role: newRecord.role,
                avatarUrl: newRecord.avatar_url
            } as User
            useKanbanStore.setState((state) => ({
                members: state.members.some(m => m.id === newMember.id)
                    ? state.members
                    : [...state.members, newMember]
            }))
          } else if (eventType === 'UPDATE') {
            const updatedMember = {
                id: newRecord.id,
                name: newRecord.name,
                role: newRecord.role,
                avatarUrl: newRecord.avatar_url
            } as User
            useKanbanStore.setState((state) => ({
                members: state.members.map(m => m.id === updatedMember.id ? updatedMember : m)
            }))
          } else if (eventType === 'DELETE') {
            useKanbanStore.setState((state) => ({
                members: state.members.filter(m => m.id !== oldRecord.id)
            }))
          }
        }
      )
      .subscribe()

    // 4. Real-time Subscription for Messages
    console.log('--- Initializing Messages Real-time Channel ---')
    const messagesChannel = supabase
      .channel('messages-realtime-global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('🔔 Real-time Message Event:', payload.eventType, payload)
          
          if (payload.eventType === 'INSERT') {
            const { new: newRecord } = payload
            const newMessage = {
              id: newRecord.id,
              content: newRecord.content,
              userId: newRecord.user_id,
              createdAt: newRecord.created_at || new Date().toISOString()
            }
            
            useKanbanStore.setState((state) => {
              const currentUser = state.currentUser
              const isMe = newRecord.user_id === currentUser?.id
              
              // If it's my message, look for an optimistic (temp) one to replace
              if (isMe) {
                const tempIndex = state.messages.findIndex(
                  m => m.id.startsWith('m-temp-') && m.content === newRecord.content
                )
                
                if (tempIndex !== -1) {
                  const updatedMessages = [...state.messages]
                  updatedMessages[tempIndex] = newMessage
                  return { messages: updatedMessages }
                }
              }

              // check for duplicates by ID
              if (state.messages.some(m => m.id === newMessage.id)) {
                return state
              }

              return { messages: [...state.messages, newMessage] }
            })
          }
        }
      )
      .subscribe((status, err) => {
        console.log('✅ Messages Channel Status:', status)
        if (err) console.error('❌ Messages Channel Error:', err)
      })

    return () => {
      console.log('--- Cleaning up Real-time Channels ---')
      supabase.removeChannel(tasksChannel)
      supabase.removeChannel(membersChannel)
      supabase.removeChannel(messagesChannel)
    }
  }, [setInitialData])
}
