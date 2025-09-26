'use client'
import { useState, useEffect } from 'react'
import { Loader2, Users, MessageCircle, CheckCircle, XCircle, Clock, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null)
  const [approvedProjects, setApprovedProjects] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return
      
      try {
        const response = await fetch(`/api/owner-stats?userEmail=${encodeURIComponent(user.email)}`)
        const data = await response.json()
        setStats(data.stats)
        setApprovedProjects(data.approvedProjects)
        setPendingRequests(data.pendingRequests)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <p className="mt-4 text-gray-300 font-medium">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Project Owner Dashboard</h1>
          <p className="text-gray-400 mb-8">Manage your projects and team members</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Requests</p>
                  <p className="text-2xl font-bold text-white">{stats?.totalRequests || 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats?.pending || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-400">{stats?.approved || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-purple-400">{stats?.activeProjects || 0}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex gap-4">
              <Link
                href="/notifications"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium gap-2"
              >
                <Clock className="w-5 h-5" />
                Manage Requests ({stats?.pending || 0})
              </Link>
              <Link
                href="/postprojects"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium gap-2"
              >
                <Users className="w-5 h-5" />
                Create New Project
              </Link>
            </div>
          </div>

          {/* Active Projects with Team Members */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Active Projects & Team Members</h2>
            
            {approvedProjects.length === 0 ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">No Active Projects</h3>
                <p className="text-gray-400 mb-4">You don't have any approved team members yet</p>
                <Link
                  href="/postprojects"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium gap-2"
                >
                  Create Your First Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {approvedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-6"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {project.imageUrl && (
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.techStack.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-800"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{project.techStack.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">
                        Team Members ({project.teamMembers.length})
                      </h4>
                      {project.teamMembers.length === 0 ? (
                        <div className="text-center py-4">
                          <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">No team members yet</p>
                          <p className="text-gray-500 text-xs">Approve requests to build your team</p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-3">
                            <button 
                              onClick={() => router.push(`/chat/${project.id}`)}
                              className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Chat with Team
                            </button>
                          </div>
                          <div className="space-y-2">
                            {project.teamMembers.map((member, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-white text-sm">{member.userEmail}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Pending Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Recent Pending Requests</h2>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="space-y-3">
                  {pendingRequests.slice(0, 3).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-white text-sm">{request.userEmail}</span>
                          <p className="text-gray-400 text-xs">wants to join {request.project.title}</p>
                        </div>
                      </div>
                      <Link
                        href="/notifications"
                        className="inline-flex items-center px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs font-medium gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        Review
                      </Link>
                    </div>
                  ))}
                  {pendingRequests.length > 3 && (
                    <div className="text-center pt-2">
                      <Link
                        href="/notifications"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View all {pendingRequests.length} pending requests →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
