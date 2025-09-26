'use client'
import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, XCircle, User, Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.email) return
      
      try {
        const response = await fetch(`/api/notifications?userEmail=${encodeURIComponent(user.email)}`)
        const data = await response.json()
        setNotifications(data)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  const handleApproveReject = async (notificationId, status) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Remove the notification from the list
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        console.log(`Request ${status} successfully`)
      } else {
        console.error(`Failed to ${status} request`)
      }
    } catch (error) {
      console.error(`Error ${status}ing request:`, error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <p className="mt-4 text-gray-300 font-medium">Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Project Requests</h1>
          <p className="text-gray-400 mb-8">Manage join requests for your projects</p>

          {notifications.length === 0 ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">No Pending Requests</h3>
              <p className="text-gray-400">You don't have any pending join requests at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-medium">{notification.userEmail}</span>
                        <span className="text-gray-400">wants to join</span>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {notification.project.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {notification.project.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Requested on {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 ml-6">
                      <button
                        onClick={() => handleApproveReject(notification.id, 'approved')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproveReject(notification.id, 'rejected')}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


