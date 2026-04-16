import { useState, useEffect } from 'react'
import { useKanbanStore } from '@/store/kanbanStore'

interface Mascot {
  id: string
  name: string
  img: string
  cheer: string
  welcome: string
}

const MASCOTS: Mascot[] = [
  {
    id: 'bunny',
    name: 'Thỏ Quyết Tâm',
    img: '/mascots/bunny.jpg',
    cheer: 'Mới thế đã nản à? Tiếp tục đi chứ! 🐰💢',
    welcome: 'Chào mừng bạn trở lại! Chiến thôi nào! 🎀'
  },
  {
    id: 'zen_cat',
    name: 'Mèo Thiền Sư',
    img: '/mascots/zen_cat.jpg',
    cheer: 'Hít một hơi thật sâu... Mọi thứ đều ổn cả. 🧘‍♂️',
    welcome: 'Nam mô... Chúc bạn một ngày làm việc bình an. 🙏'
  },
  {
    id: 'hamster',
    name: 'Hamster Gym',
    img: '/mascots/hamster.jpg',
    cheer: 'Không làm mà đòi có ăn à? Tập trung vào! 🐹🏋️',
    welcome: 'Khởi động xong chưa? Vô việc thôi! 💪'
  },
  {
    id: 'cats',
    name: 'Cặp Mèo Support',
    img: '/mascots/cats.jpg',
    cheer: 'Chúng mình tin bạn làm được! Cố lên! 🐱🐱',
    welcome: 'Có chúng mình đây rồi, đừng lo nhé! 💖'
  },
  {
    id: 'tomato',
    name: 'Cà Chua Sassy',
    img: '/mascots/tomato.jpg',
    cheer: 'Nhìn cái gì? Tập trung làm việc đi! 🍅',
    welcome: 'Lại vào check-in à? Làm việc đi nha! 🔥'
  }
]

export default function MascotCheer() {
  const { currentUser } = useKanbanStore()
  const [mascot, setMascot] = useState<Mascot | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [bubbleText, setBubbleText] = useState('')

  useEffect(() => {
    // Pick a random mascot on mount
    const randomMascot = MASCOTS[Math.floor(Math.random() * MASCOTS.length)]
    setMascot(randomMascot)
    
    // Welcome message after a short delay
    const timer = setTimeout(() => {
      setBubbleText(randomMascot.welcome)
      setIsVisible(true)
    }, 1500)

    // Hide bubble after 6 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 7500)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!mascot) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
      {/* Speech Bubble */}
      <div 
        className={`
          mb-4 px-4 py-3 bg-white rounded-2xl shadow-xl border-2 border-pink-100 text-sm font-medium text-pink-700 max-w-[200px] relative
          transition-all duration-500 transform
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
      >
        {bubbleText.replace('[Name]', currentUser?.name || 'bạn')}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-pink-100 rotate-45" />
      </div>

      {/* Mascot Image */}
      <div 
        className="w-28 h-28 md:w-36 md:h-36 pointer-events-auto cursor-pointer group relative"
        onClick={() => {
          setBubbleText(mascot.cheer)
          setIsVisible(true)
          setTimeout(() => setIsVisible(false), 4000)
        }}
      >
        <img 
          src={mascot.img} 
          alt={mascot.name}
          className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-xl relative transition-transform duration-500 hover:scale-110 active:scale-95 animate-float"
        />
        
        {/* Tooltip on Hover */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Click để được cổ vũ! ✨
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
