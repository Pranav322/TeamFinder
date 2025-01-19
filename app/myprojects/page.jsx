'use client'
import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';



function MyProjects() {
  
 
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user?.email) {
        
        try {
          const response = await fetch('/api/myprojects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email }),
          });

          const data = await response.json();
          setProjects(data.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [user]);

  if (!user) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <>
   
    
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Projects</h1>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <li key={index} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <p className="text-gray-500">Tech Stack: {project.techStack.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default MyProjects;
