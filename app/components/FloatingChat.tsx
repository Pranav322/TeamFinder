'use client'
import { useState, useEffect } from 'react'
import { MessageCircle, X, ChevronDown, ChevronUp, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ChatSummary {
  projectId: string
  projectTitle: string
  projectImage?: string
  latestMessage: {
    message: string
    userEmail: string
    createdAt: string
    isFromUser: boolean
  }
  unreadCount: number
  isOwner: boolean
  hasUnread: boolean
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [chats, setChats] = useState<ChatSummary[]>([])
  const [totalUnread, setTotalUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const fetchChats = async () => {
    if (!user?.email) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/chat/unread?userEmail=${encodeURIComponent(user.email)}`)
      const data = await response.json()
      
      if (response.ok) {
        setChats(data.chats)
        setTotalUnread(data.totalUnread)
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.email) {
      fetchChats()
      // Poll for new messages every 10 seconds
      const interval = setInterval(fetchChats, 10000)
      return () => clearInterval(interval)
    }
  }, [user])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
  }

  if (!user) return null

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
          {totalUnread > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </button>
      </div>

      {/* Chat Sidebar */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-40 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Messages</h3>
              {totalUnread > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {totalUnread}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto max-h-80">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
                <p className="text-gray-400 text-sm mt-2">Loading messages...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No messages yet</p>
                <p className="text-gray-500 text-xs mt-1">Start a conversation in your projects</p>
              </div>
            ) : (
              <div className="p-2">
                {chats.map((chat) => (
                  <div
                    key={chat.projectId}
                    onClick={() => {
                      router.push(`/chat/${chat.projectId}`)
                      setIsOpen(false)
                    }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group"
                  >
                    {/* Project Image */}
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                      {chat.projectImage ? (
                        <Image
                          src={chat.projectImage}
                          alt={chat.projectTitle}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white text-sm font-medium truncate">
                          {chat.projectTitle}
                        </h4>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatTime(chat.latestMessage.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate ${
                          chat.hasUnread ? 'text-white font-medium' : 'text-gray-400'
                        }`}>
                          <span className="text-gray-500">
                            {chat.latestMessage.isFromUser ? 'You: ' : ''}
                          </span>
                          {truncateMessage(chat.latestMessage.message)}
                        </p>
                        
                        {chat.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold flex-shrink-0">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-700">
            <button
              onClick={() => {
                router.push('/projects')
                setIsOpen(false)
              }}
              className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View All Projects
            </button>
          </div>
        </div>
      )}
    </>
  )
}
