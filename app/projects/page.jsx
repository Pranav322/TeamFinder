'use client'
import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = user?.email ? `/api/projects?userEmail=${encodeURIComponent(user.email)}` : '/api/projects'
        const response = await fetch(url)
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  const handleRequest = async (projectId, projectOwnerEmail) => {
    if (!user?.email) return
    
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        body: JSON.stringify({ projectId, userEmail: user.email, projectOwnerEmail }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Update the project's request status locally
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project.id === projectId 
              ? { ...project, requestStatus: 'pending' }
              : project
          )
        )
        console.log('Request sent successfully')
      } else {
        const errorData = await response.json()
        console.error('Failed to send request:', errorData.error)
      }
    } catch (error) {
      console.error('Error sending request:', error)
    }
  }

  const getButtonContent = (project) => {
    if (!project.requestStatus) {
      return (
        <>
          Request to Join
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </>
      )
    }
    
    switch (project.requestStatus) {
      case 'pending':
        return (
          <>
            <Clock className="w-4 h-4" />
            Request Pending
          </>
        )
      case 'approved':
        return (
          <>
            <MessageCircle className="w-4 h-4" />
            Chat
          </>
        )
      case 'rejected':
        return (
          <>
            <XCircle className="w-4 h-4" />
            Request Rejected
          </>
        )
      default:
        return 'Request to Join'
    }
  }

  const getButtonStyles = (project) => {
    if (!project.requestStatus) {
      return "w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm gap-2"
    }
    
    switch (project.requestStatus) {
      case 'pending':
        return "w-full inline-flex justify-center items-center px-4 py-2 bg-yellow-600 text-white rounded-lg cursor-not-allowed font-medium text-sm gap-2"
      case 'approved':
        return "w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm gap-2"
      case 'rejected':
        return "w-full inline-flex justify-center items-center px-4 py-2 bg-red-600 text-white rounded-lg cursor-not-allowed font-medium text-sm gap-2"
      default:
        return "w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm gap-2"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <p className="mt-4 text-gray-300 font-medium">Loading available projects...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Browse Projects</h1>
          <p className="text-gray-400 mb-8">Discover projects and connect with team members</p>

          {projects.length === 0 ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Available</h3>
              <p className="text-gray-400 mb-6">Check back later for new opportunities</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 p-6 transition-all duration-200"
                >
                  <div className="flex flex-col h-full">
                    {project.imageUrl && (
                      <div className="mb-4 relative h-48 w-full rounded-lg overflow-hidden">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h2>
                      <p className="mt-2 text-gray-400 line-clamp-3">{project.description}</p>
                    </div>

                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.map((tech, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-300 border border-blue-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <button
                          onClick={() => {
                            if (!project.requestStatus) {
                              handleRequest(project.id, project.userEmail)
                            } else if (project.requestStatus === 'approved') {
                              router.push(`/chat/${project.id}`)
                            }
                          }}
                          disabled={project.requestStatus === 'pending' || project.requestStatus === 'rejected'}
                          className={getButtonStyles(project)}
                        >
                          {getButtonContent(project)}
                        </button>
                      </div>
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