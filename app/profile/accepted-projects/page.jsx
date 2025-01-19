// app/profile/accepted-projects/page.jsx
// This page is for the user to see the projects they have been accepted to
'use client'

import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';

export default function AcceptedProjects() {

  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedProjects = async () => {
      if (user?.email) {
        console.log('Current user email:', user.email);
        
        try {
          const response = await fetch('/api/accepted-projects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email }),
          });
  
          const data = await response.json();
          console.log('Accepted projects response:', data); // Add this log
          setProjects(data.data || []);
        } catch (error) {
          console.error('Error fetching accepted projects:', error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchAcceptedProjects();
  }, [user]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Accepted Projects</h1>
      {projects.length === 0 ? (
        <p>You haven't been accepted to any projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
