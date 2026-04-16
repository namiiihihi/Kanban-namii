import { useState } from 'react'
import { useKanbanStore } from '@/store/kanbanStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles, Heart, Star } from 'lucide-react'

export default function LoginView() {
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const login = useKanbanStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !nickname.trim()) return
    
    setIsLoading(true)
    try {
      // Concatenate Name + Nickname for the unique database identity if needed
      // Or just use Name as requested
      await login(name.trim())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-pink-50/80 backdrop-blur-xl p-4">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-20 animate-bounce text-pink-300 opacity-50">
        <Heart className="h-12 w-12 fill-current" />
      </div>
      <div className="absolute bottom-20 right-20 animate-pulse text-pink-300 opacity-50">
        <Star className="h-12 w-12 fill-current" />
      </div>
      <div className="absolute top-1/4 right-1/4 animate-spin-slow text-pink-200 opacity-30">
        <Sparkles className="h-24 w-24" />
      </div>

      <Card className="w-full max-w-md bg-white/60 border-pink-100 shadow-2xl rounded-[2rem] overflow-hidden border-2">
        <div className="h-2 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500" />
        <CardHeader className="text-center pt-10 pb-6 px-8">
          <div className="mx-auto bg-pink-100 h-20 w-20 rounded-3xl flex items-center justify-center mb-6 shadow-inner transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <span className="text-4xl">🎀</span>
          </div>
          <CardTitle className="text-3xl font-extrabold text-pink-600 tracking-tight">
            Chào mừng bạn! 💖
          </CardTitle>
          <CardDescription className="text-pink-400 font-medium mt-2">
            Nhập tên và biệt danh thân thiết để bắt đầu làm việc cùng team nhé ✨
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-pink-500 uppercase tracking-widest pl-1">
                Họ và Tên 🌸
              </label>
              <Input
                placeholder="Ví dụ: Bùi Xuân Nhi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-white/80 border-pink-100 focus:border-pink-300 focus:ring-pink-200 rounded-2xl text-pink-900"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-pink-500 uppercase tracking-widest pl-1">
                Biệt danh thân thiết 🍭
              </label>
              <Input
                placeholder="Ví dụ: Nhi Đáng Yêu"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-12 bg-white/80 border-pink-100 focus:border-pink-300 focus:ring-pink-200 rounded-2xl text-pink-900"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-pink-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Vào Workspace ngay 🚀"}
            </Button>
          </form>
          <p className="text-center mt-8 text-[10px] text-pink-300 uppercase font-bold tracking-[0.2em]">
            Lark Inspired • Shared with Love 💖
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
