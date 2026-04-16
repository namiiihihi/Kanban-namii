import { useState, useRef, useEffect } from 'react'
import { useKanbanStore } from '@/store/kanbanStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Hash, Search } from 'lucide-react'
import { format } from 'date-fns'

export default function MessengerView() {
  const { messages, members, currentUser, sendMessage } = useKanbanStore()
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isSending) return
    
    const content = inputValue.trim()
    setInputValue('') // Clear immediately to prevent double-send
    setIsSending(true)
    
    try {
      await sendMessage(content)
    } finally {
      setIsSending(false)
    }
  }

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  return (
    <div className="h-full flex bg-white/20 backdrop-blur-md rounded-tl-3xl border-t border-l border-pink-100/50 overflow-hidden">
      {/* Members Sidebar */}
      <div className="w-64 border-r border-pink-50 flex flex-col bg-white/40">
        <div className="p-4 border-b border-pink-50 flex items-center justify-between">
          <h2 className="font-semibold text-pink-600 flex items-center gap-2">
            Workspace 💖
          </h2>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-300" />
            <Input 
              placeholder="Search members..." 
              className="pl-9 bg-pink-50/50 border-pink-100 focus-visible:ring-pink-200"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
              Direct Messages
            </div>
            {members.map((member) => (
              <div 
                key={member.id}
                className="flex items-center gap-3 px-3 py-2 rounded-xl border border-transparent hover:bg-pink-50 hover:border-pink-100 cursor-pointer transition-all group"
              >
                <div className="relative">
                  <Avatar className="h-9 w-9 border border-pink-100">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback className="bg-pink-50 text-pink-600">
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-pink-900 truncate">
                    {member.name} {member.id === currentUser?.id && ' (You)'}
                  </p>
                  <p className="text-xs text-pink-400 truncate">Online</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-pink-50/10">
        {/* Chat Header */}
        <div className="h-14 px-6 border-b border-pink-50 flex items-center justify-between bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-pink-400" />
            <h3 className="font-semibold text-pink-900"># Team Chat 🎀</h3>
          </div>
        </div>

        {/* Messages List */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((msg, index) => {
              const senderFromMembers = members.find(m => m.id === msg.userId)
              const isMe = msg.userId === currentUser?.id
              const sender = senderFromMembers || (isMe ? currentUser : null)
              const showAvatar = index === 0 || messages[index - 1].userId !== msg.userId

              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-9 h-9 flex-shrink-0 ${!showAvatar && 'opacity-0'}`}>
                    <Avatar className="h-9 w-9 border border-pink-100">
                      <AvatarImage src={sender?.avatarUrl} />
                      <AvatarFallback className="bg-pink-100 text-pink-600">
                        {sender?.name.substring(0, 2).toUpperCase() || '??'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {showAvatar && (
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-xs font-bold text-pink-700">{sender?.name}</span>
                        <span className="text-[10px] text-pink-300">
                          {format(new Date(msg.createdAt), 'HH:mm')}
                        </span>
                      </div>
                    )}
                    <div className={`
                      px-4 py-2.5 rounded-2xl shadow-sm text-sm
                      ${isMe 
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-tr-none' 
                        : 'bg-white text-pink-900 border border-pink-50 rounded-tl-none'
                      }
                    `}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 bg-white/40 backdrop-blur-md border-t border-pink-50">
          <form 
            onSubmit={handleSend}
            className="max-w-4xl mx-auto flex gap-2 items-end bg-white rounded-2xl p-2 shadow-sm border border-pink-100 focus-within:border-pink-300 transition-colors"
          >
            <div className="flex-1 px-2 mb-1">
              <textarea 
                placeholder={isSending ? "Sending... ✨" : "Type a message... 💖"}
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-1.5 resize-none max-h-32 text-pink-900 scrollbar-hide disabled:opacity-50"
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isSending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(e)
                  }
                }}
              />
            </div>
            <Button 
                type="submit" 
                size="icon" 
                disabled={isSending || !inputValue.trim()}
                className="bg-pink-500 hover:bg-pink-600 h-9 w-9 rounded-xl flex-shrink-0 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="max-w-4xl mx-auto pt-2 flex items-center gap-4 text-[11px] text-pink-300 px-4">
            <span className="hover:text-pink-500 cursor-pointer">Press Enter to send</span>
            <span className="hover:text-pink-500 cursor-pointer">Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  )
}
