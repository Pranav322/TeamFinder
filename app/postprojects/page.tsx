'use client'
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import NavBar from '../components/NavBar';
import { useRouter } from 'next/navigation'
export default function ProjectForm() {
  const router = useRouter()
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const userEmail = user?.email || '';


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      title,
      description,
      techStack: techStack.split(',').map((tech) => tech.trim()),
      userEmail,
    };

    try {
      const response = await fetch('/api/createproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        console.log('Project created successfully');
        router.push('/projects')
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    <NavBar />
   
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Create Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-md p-2 w-full h-32"
            required
          ></textarea>
          <input
            type="text"
            placeholder="Tech Stack (comma separated)"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-full"
           
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
